import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

import { fetchUser } from '@/lib/actions/user.actions'
import AccountProfile from '@/components/forms/AccountProfile'
import PageLabel from '@/components/ui/label-page'

async function Page() {
  const user = await currentUser()
  if (!user) return null

  const userInfo = await fetchUser(user.id)
  if (!userInfo?.onboarded) redirect('/onboarding')

  const userData = {
    id: user.id,
    objectId: userInfo?._id?.toString(),
    username: userInfo ? userInfo?.username : user.username,
    name: userInfo ? userInfo?.name : user.firstName ?? '',
    bio: userInfo ? userInfo?.bio : '',
    image: userInfo ? userInfo?.image : user.imageUrl,
  }

  return (
    <>
      <PageLabel>Edit Profile</PageLabel>

      <section className="mt-12">
        <AccountProfile user={userData} btnTitle="Continue" />
      </section>
    </>
  )
}

export default Page
