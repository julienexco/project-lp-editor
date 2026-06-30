import { NextResponse } from 'next/server'
import type { BlockInstance, PageMeta } from '@lp-studio/types'
import { getPage, updatePage } from '@/lib/page-store'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const page = await getPage(id)
  if (!page) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(page)
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  let body: { blocks?: BlockInstance[]; meta?: PageMeta }
  try {
    body = (await request.json()) as { blocks?: BlockInstance[]; meta?: PageMeta }
  } catch {
    return NextResponse.json({ error: 'Corps JSON invalide' }, { status: 400 })
  }

  if (!body.blocks && !body.meta) {
    return NextResponse.json({ error: 'blocks or meta required' }, { status: 400 })
  }

  try {
    const page = await updatePage(id, { blocks: body.blocks, meta: body.meta })
    return NextResponse.json(page)
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Update failed'
    console.error('[api/pages] PATCH failed:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
