import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Post a Job - EUJobs.co',
  description: 'Post your EU affairs job opening and reach thousands of qualified professionals in Brussels.',
}

export default function PostJobLayout({ children }: { children: React.ReactNode }) {
  return children
}
