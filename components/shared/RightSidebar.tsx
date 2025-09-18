import { currentUser } from '@clerk/nextjs/server'

import UserCard from '../cards/UserCard'

import { fetchCommunities } from '@/lib/actions/community.actions'
import { fetchUsers } from '@/lib/actions/user.actions'
import { Button } from '../ui/button'
import Image from 'next/image'
import UserPreview from '../cards/UserPreview'

async function RightSidebar() {
  const user = await currentUser()
  if (!user) return null

  const similarMinds = await fetchUsers({
    userId: user.id,
    pageSize: 4,
  })

  const suggestedCOmmunities = await fetchCommunities({ pageSize: 4 })

  return (
    <section className="custom-scrollbar rightsidebar">
      <div className="flex flex-1 flex-col justify-start">
        <Button type="button" className="bg-light-2 text-dark-2 ">
          Suggested Communities
        </Button>

        <div className="mt-7 flex flex-col gap-9">
          {suggestedCOmmunities.communities.length > 0 ? (
            <>
              {suggestedCOmmunities.communities.map(community => (
                <UserPreview
                  key={community.id}
                  id={community.id}
                  name={community.name}
                  username={community.username}
                  imgUrl={community.image}
                  personType="Community"
                />
              ))}
            </>
          ) : (
            <p className="!text-base-regular text-light-3">No communities yet</p>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-start">
        <Button type="button" className="bg-light-2 text-dark-2 ">
          Similar Minds
        </Button>
        <div className="mt-7 flex flex-col w-70 gap-10">
          {similarMinds.users.length > 0 ? (
            <>
              {similarMinds.users.map(person => (
                <UserPreview
                  key={person.id}
                  id={person.id}
                  name={person.name}
                  username={person.username}
                  imgUrl={person.image}
                  personType="User"
                />
              ))}
            </>
          ) : (
            <p className="!text-base-regular text-light-3">No users yet</p>
          )}
        </div>
      </div>
    </section>
  )
}

export default RightSidebar
