import PageLabel from '@/components/ui/label-page'
import { fetchUser, fetchUsers, getActivity } from '@/lib/actions/user.actions'
import { currentUser } from '@clerk/nextjs/server'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function Page() {
  const user = await currentUser()
  if (!user) return null

  const userInfo = await fetchUser(user.id)
  if (!userInfo?.onboarded) redirect('/onboarding')

  const activity = await getActivity(userInfo._id)

  return (
    <section>
      <PageLabel>Activity</PageLabel>

      <div className="mt-10 flex flex-col gap-5">
        {activity.length > 0 ? (
          <>
            {activity.map(activity => (
              <Link key={activity.id} href={`/thread/${activity.parentId}`}>
                <article className="activity-card">
                  <Image
                    src={activity.author.image}
                    alt="Profile Picture"
                    width={20}
                    height={20}
                    className="rounded-full object-contain"
                  />
                  <p className="text-small-regular text-light-1">
                    <span className="mr-1 text-primary-500">{activity.author.name}</span> replies to
                    your thread
                  </p>
                </article>
              </Link>
            ))}
          </>
        ) : (
          <p> No activity yet</p>
        )}
      </div>
    </section>
  )
}
