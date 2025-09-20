import PostThread from '@/components/forms/PostThread'
import PageLabel from '@/components/ui/label-page'
import { fetchUser } from '@/lib/actions/user.actions'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

async function Page() {
  const user = await currentUser()

  if (!user) return null
  const userInfo = await fetchUser(user.id)

  if (!userInfo?.onboarded) redirect('/onboarding')

  return (
    <>
      <PageLabel>Create Thread</PageLabel>

      <PostThread userId={`${userInfo._id}`} />
    </>
  )
}

export default Page
