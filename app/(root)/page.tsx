import ThreadCard from '@/components/cards/ThreadCard'
import { Button } from '@/components/ui/button'
import { fetchPosts } from '@/lib/actions/thread.actions'
import { currentUser } from '@clerk/nextjs/server'
import Image from 'next/image'
import Link from 'next/link'
import SearchWrapper from '@/components/shared/SearchWrapper'
import PageLabel from '@/components/ui/label-page'

export default async function Home() {
  const result = await fetchPosts(1, 30)
  const user = await currentUser()
  const plainPosts = JSON.parse(JSON.stringify(result.posts))

  return (
    <>
      <div className="flex items-center justify-between gap-2 ">
        <PageLabel>What's New</PageLabel>

        <SearchWrapper posts={plainPosts} currentUserId={user?.id || ''} />

        <Button type="button" className="bg-primary-500 text-light-1 hover:bg-primary-500/70">
          <Link href="/create-thread" className="flex items-center gap-2">
            <Image src="/create.svg" alt="Create Thread" width={25} height={24} /> Create a thread
          </Link>
        </Button>
      </div>

      <section className="mt-4 flex flex-col gap-6">
        {result.posts.length === 0 ? (
          <p className="no-result">No threads found</p>
        ) : (
          <>
            {result.posts.map(post => (
              <ThreadCard
                key={post._id}
                id={post._id}
                currentUserId={user?.id || ''}
                parentId={post.parentId}
                content={post.text}
                author={post.author}
                community={post.community}
                createdAt={post.createdAt}
                comments={post.children}
              />
            ))}
          </>
        )}
      </section>
    </>
  )
}
