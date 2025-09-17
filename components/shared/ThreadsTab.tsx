import { fetchUserPosts } from '@/lib/actions/user.actions'
import { redirect } from 'next/navigation'
import ThreadCard from '../cards/ThreadCard'
import { fetchCommunityPosts } from '@/lib/actions/community.actions'

interface ThreadProps {
  currentUserId: string
  accountId: string
  accountType: string
}

const ThreadsTab = async ({ currentUserId, accountId, accountType }: ThreadProps) => {
  let result: any

  if (accountType === 'Community') {
    result = await fetchCommunityPosts(accountId)
  } else {
    result = await fetchUserPosts(accountId)
  }

  if (!result) redirect('/')

  const threads = result.threads || []

  return (
    <section className="mt-9 flex flex-col gap-10">
      {threads.length > 0 ? (
        threads.map((thread: any) => (
          <ThreadCard
            key={thread._id.toString()}
            id={thread._id.toString()}
            currentUserId={currentUserId}
            parentId={thread.parentId?.toString() || null}
            content={thread.text}
            author={
              accountType === 'User'
                ? { name: result.name, image: result.image, id: result.id }
                : { name: thread.author.name, image: thread.author.image, id: thread.author.id }
            }
            community={
              accountType === 'Community'
                ? { id: accountId, name: result.name, image: result.image }
                : thread.community
            }
            createdAt={thread.createdAt}
            comments={thread.children}
          />
        ))
      ) : (
        <p className="text-center text-light-2">No threads found</p>
      )}
    </section>
  )
}

export default ThreadsTab
