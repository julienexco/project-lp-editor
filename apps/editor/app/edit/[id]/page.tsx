import { notFound } from 'next/navigation'
import { EditorShell } from '@/components/editor/EditorShell'
import { getPage } from '@/lib/page-store'

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const page = await getPage(id)
  if (!page) notFound()

  return <EditorShell pageId={id} initialPage={page} />
}
