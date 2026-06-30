import { NextResponse } from 'next/server'
import type { BlockInstance } from '@lp-studio/types'
import { getPage, updatePageBlocks } from '@/lib/page-store'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const page = await getPage(id)
  if (!page) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(page)
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  let body: { blocks?: BlockInstance[] }
  try {
    body = (await request.json()) as { blocks?: BlockInstance[] }
  } catch {
    return NextResponse.json({ error: 'Corps JSON invalide' }, { status: 400 })
  }

  if (!body.blocks) return NextResponse.json({ error: 'blocks required' }, { status: 400 })

  try {
    const page = await updatePageBlocks(id, body.blocks)
    return NextResponse.json(page)
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Update failed'
    console.error('[api/pages] PATCH failed:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
