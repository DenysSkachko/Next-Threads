import AccountProfile from '@/components/forms/AccountProfile'
import { fetchUser } from '@/lib/actions/user.actions'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

async function Page() {
  const user = await currentUser()
  if (!user) return null

  const userInfo = await fetchUser(user.id)
  if (userInfo?.onboarded) redirect('/')

  const userData = {
    id: user?.id,
    objectId: userInfo?._id,
    username: userInfo?.username || user?.username,
    name: userInfo?.name || user?.firstName || '',
    blogInfo: userInfo?.bio || '',
    image: userInfo?.image || user?.imageUrl,
  }

  return (
    <main className="mx-auto flex max-w-3xl flex-col justify-start px-10 py-10 items-center">
      <h1 className="head-text">Onboarding</h1>
      <p className="mt-3 text-base-regular text-light-1">
        Complete your profile now to use Threads
      </p>

      <section className="mt-5 bg-dark-4 p-10 rounded-2xl">
        <AccountProfile user={userData} btnTitle="Continue" />
      </section>
    </main>
  )
}

export default Page
