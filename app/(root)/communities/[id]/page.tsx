import ProfileHeader from '@/components/shared/ProfileHeader'
import { fetchCommunityDetails } from '@/lib/actions/community.actions'
import { currentUser } from '@clerk/nextjs/server'
import ThreadsTab from '@/components/shared/ThreadsTab'
import UserCard from '@/components/cards/UserCard'
import Tabs from '@/components/shared/Tabs'

interface PageProps {
  params: Promise<{ id: string | string[] }>
}

export default async function Page({ params }: PageProps) {
  const { id } = await params
  if (!id) return null

  const user = await currentUser()
  if (!user) return <div>Пользователь не авторизован</div>

  const communityId = Array.isArray(id) ? id[0] : id
  const communityDetails = await fetchCommunityDetails(communityId)
  if (!communityDetails) return <div>Сообщество не найдено</div>

  return (
    <section>
      <ProfileHeader
        accountId={communityDetails._id.toString()}
        authUserId={user.id}
        name={communityDetails.name}
        username={communityDetails.username}
        imgUrl={communityDetails.image}
        bio={communityDetails.bio}
        type="Community"
      />

      <Tabs
        tabs={[
          {
            label: 'Threads',
            count: communityDetails.threads?.length ?? 0,
            content: (
              <ThreadsTab
                currentUserId={user.id}
                accountId={communityDetails._id.toString()}
                accountType="Community"
              />
            ),
          },
          {
            label: 'Members',
            count: communityDetails.members?.length ?? 0,
            content: (
              <section className="flex flex-col gap-6 mt-4">
                {communityDetails.members?.map((member: any) => (
                  <UserCard
                    key={member.id}
                    id={member.id}
                    name={member.name}
                    username={member.username}
                    imgUrl={member.image}
                    personType="User"
                  />
                ))}
              </section>
            ),
          },
        ]}
      />
    </section>
  )
}
