import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import type { BlockInstance, PageMeta, PageRecord } from '@lp-studio/types'
import { normalizePageBlocks } from '@lp-studio/registry'
import { mergePageCustomColors } from '@lp-studio/tokens'
import { createClient } from '@supabase/supabase-js'

const DEFAULT_PAGE_ID = '00000000-0000-4000-8000-000000000001'

function getLocalStorePath() {
  return join(process.cwd(), 'data', 'local-page.json')
}

function loadSeed(): PageRecord {
  const seedPath = join(process.cwd(), '../../supabase/seed/upscaly-consulting.json')
  const raw = readFileSync(seedPath, 'utf-8')
  const parsed = JSON.parse(raw) as PageRecord
  return withDefaults(parsed)
}

function readLocalPage(id: string): PageRecord {
  const storePath = getLocalStorePath()
  if (!existsSync(storePath)) {
    const seed = loadSeed()
    const dir = join(process.cwd(), 'data')
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
    writeFileSync(storePath, JSON.stringify(seed, null, 2))
    return seed
  }
  const page = JSON.parse(readFileSync(storePath, 'utf-8')) as PageRecord
  if (page.id !== id) return { ...loadSeed(), id }
  return withDefaults(page)
}

function writeLocalPage(page: PageRecord) {
  const dir = join(process.cwd(), 'data')
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  writeFileSync(getLocalStorePath(), JSON.stringify(page, null, 2))
}

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return false
  if (url.includes('your-project')) return false
  if (key.includes('your-service-role-key')) return false
  return true
}

function getSupabaseAdmin() {
  if (!isSupabaseConfigured()) return null
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

function withDefaults(page: PageRecord): PageRecord {
  const blocks = normalizePageBlocks(page.blocks)
  const meta: PageMeta = { ...(page.meta ?? {}) }
  meta.customColors = mergePageCustomColors(meta, blocks)
  return {
    ...page,
    blocks,
    config: page.config ?? {},
    meta,
    schema_version: page.schema_version ?? '1.0.0',
  }
}

export async function getPage(id: string): Promise<PageRecord | null> {
  const supabase = getSupabaseAdmin()
  if (supabase) {
    const { data, error } = await supabase.from('pages').select('*').eq('id', id).single()
    if (!error && data) return withDefaults(data as PageRecord)
  }
  return readLocalPage(id)
}

export type PagePatch = {
  blocks?: BlockInstance[]
  meta?: PageMeta
  name?: string
}

export async function updatePage(id: string, patch: PagePatch): Promise<PageRecord> {
  const current = await getPage(id)
  if (!current) throw new Error('Page not found')

  const normalizedBlocks = patch.blocks ? normalizePageBlocks(patch.blocks) : current.blocks
  const meta: PageMeta = { ...current.meta, ...patch.meta }
  if (patch.meta?.customColors) {
    meta.customColors = mergePageCustomColors(meta, normalizedBlocks)
  } else {
    meta.customColors = mergePageCustomColors(meta, normalizedBlocks)
  }

  const updatedAt = new Date().toISOString()
  const nextName = patch.name?.trim() || current.name
  const supabase = getSupabaseAdmin()

  if (supabase) {
    const { data, error } = await supabase
      .from('pages')
      .update({ blocks: normalizedBlocks, meta, name: nextName, updated_at: updatedAt })
      .eq('id', id)
      .select('*')
      .single()

    if (!error && data) return withDefaults({ ...(data as PageRecord), updated_at: updatedAt })
    console.warn('[page-store] Supabase save failed, falling back to local file:', error?.message)
  }

  const next: PageRecord = {
    ...current,
    blocks: normalizedBlocks,
    meta,
    name: nextName,
    updated_at: updatedAt,
  }
  writeLocalPage(next)
  return next
}

/** @deprecated use updatePage */
export async function updatePageBlocks(id: string, blocks: BlockInstance[]): Promise<PageRecord> {
  return updatePage(id, { blocks })
}

export { DEFAULT_PAGE_ID }
