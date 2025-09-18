import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

import ProfileHeader from '@/components/shared/ProfileHeader'
import ThreadsTab from '@/components/shared/ThreadsTab'
import { fetchUser } from '@/lib/actions/user.actions'

async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const user = await currentUser()
  if (!user) return null

  const userInfo = await fetchUser(params.id)
  if (!userInfo?.onboarded) redirect('/onboarding')

  return (
    <section>
      <ProfileHeader
        accountId={userInfo.id}
        authUserId={user.id}
        name={userInfo.name}
        username={userInfo.username}
        imgUrl={userInfo.image}
        bio={userInfo.bio}
      />

      <div className="mt-9">
        <ThreadsTab currentUserId={user.id} accountId={userInfo.id} accountType="User" />
      </div>
    </section>
  )
}

export default Page
