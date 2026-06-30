import { redirect } from 'next/navigation'

const DEFAULT_PAGE_ID = process.env.NEXT_PUBLIC_DEFAULT_PAGE_ID ?? '00000000-0000-4000-8000-000000000001'

export default function HomePage() {
  redirect(`/edit/${DEFAULT_PAGE_ID}`)
}
