import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import type { BlockInstance, PageRecord } from '@lp-studio/types'
import { normalizePageBlocks } from '@lp-studio/registry'
import { createClient } from '@supabase/supabase-js'

const DEFAULT_PAGE_ID = '00000000-0000-4000-8000-000000000001'

function getLocalStorePath() {
  return join(process.cwd(), 'data', 'local-page.json')
}

function loadSeed(): PageRecord {
  const seedPath = join(process.cwd(), '../../supabase/seed/upscaly-consulting.json')
  const raw = readFileSync(seedPath, 'utf-8')
  const parsed = JSON.parse(raw) as PageRecord
  return {
    ...parsed,
    blocks: normalizePageBlocks(parsed.blocks),
    config: parsed.config ?? {},
    meta: parsed.meta ?? {},
    schema_version: parsed.schema_version ?? '1.0.0',
    status: parsed.status ?? 'draft',
  }
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
  return { ...page, blocks: normalizePageBlocks(page.blocks) }
}

function writeLocalPage(page: PageRecord) {
  const dir = join(process.cwd(), 'data')
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  writeFileSync(getLocalStorePath(), JSON.stringify(page, null, 2))
}

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key || url.includes('your-project')) return null
  return createClient(url, key)
}

export async function getPage(id: string): Promise<PageRecord | null> {
  const supabase = getSupabaseAdmin()
  if (supabase) {
    const { data, error } = await supabase.from('pages').select('*').eq('id', id).single()
    if (error || !data) return readLocalPage(id)
    return data as PageRecord
  }
  return readLocalPage(id)
}

export async function updatePageBlocks(id: string, blocks: BlockInstance[]): Promise<PageRecord> {
  const supabase = getSupabaseAdmin()
  const updatedAt = new Date().toISOString()

  if (supabase) {
    const { data, error } = await supabase
      .from('pages')
      .update({ blocks, updated_at: updatedAt })
      .eq('id', id)
      .select('*')
      .single()
    if (error || !data) throw new Error(error?.message ?? 'Update failed')
    return data as PageRecord
  }

  const page = readLocalPage(id)
  const next = { ...page, blocks, updated_at: updatedAt }
  writeLocalPage(next)
  return next
}

export { DEFAULT_PAGE_ID }
