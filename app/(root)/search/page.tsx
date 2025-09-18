import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'

import UserCard from '@/components/cards/UserCard'
import Searchbar from '@/components/shared/SearchUser'
import Pagination from '@/components/shared/Pagination'

import { fetchUser, fetchUsers } from '@/lib/actions/user.actions'
import PageLabel from '@/components/ui/label-page'

async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const params = await searchParams
  const user = await currentUser()
  if (!user) return null

  const userInfo = await fetchUser(user.id)
  if (!userInfo?.onboarded) redirect('/onboarding')

  const result = await fetchUsers({
    userId: user.id,
    searchString: params.q,
    pageNumber: params?.page ? +params.page : 1,
    pageSize: 25,
  })

  if (!result) {
    return 1
  }

  return (
    <section>
      <div className="flex items-center justify-between gap-2 h-10">
        <PageLabel>Search</PageLabel>
        <Searchbar routeType="search" />
      </div>

      <div className="mt-4 flex flex-col gap-9">
        {result.users.length === 0 ? (
          <p className="no-result">No Result</p>
        ) : (
          <>
            {result.users.map(person => (
              <UserCard
                key={person.id}
                id={person.id}
                name={person.name}
                username={person.username}
                imgUrl={person.image}
                personType="User"
                style="search"
              />
            ))}
          </>
        )}
      </div>

      <Pagination
        path="search"
        pageNumber={params?.page ? +params.page : 1}
        isNext={result.isNext}
      />
    </section>
  )
}

export default Page
