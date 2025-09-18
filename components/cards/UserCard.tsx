'use client'

import Image from 'next/image'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'

interface UserProps {
  id: string
  name: string
  username: string
  imgUrl: string
  personType: string
  style?: 'main' | 'search'
}

const UserCard = ({ id, name, username, imgUrl, personType, style = 'main' }: UserProps) => {
  const router = useRouter()

  return (
    <article
      className={`
        flex flex-col justify-between gap-4 max-[400px]:rounded-lg max-[400px]:p-2
        min-[400px]:flex-row min-[400px]:items-center min-[400px]:p-3
        transition-all ${style === 'search' ? 'bg-light-1 rounded-xl' : 'bg-dark-3'}
      `}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Image
          src={imgUrl}
          alt={`${name}'s avatar`}
          width={40}
          height={40}
          className="rounded-full flex-shrink-0"
        />
        <div className="flex flex-col overflow-hidden">
          <h4
            className={`text-base-semibold  truncate ${
              style === 'search' ? 'text-dark-2' : 'text-light-1'
            }`}
          >
            {name}
          </h4>
          <p className="text-small-medium text-gray-1 truncate">@{username}</p>
        </div>
      </div>

      <Button
        onClick={() => router.push(`/profile/${id}`)}
        className="flex-shrink-0 px-3 py-1 text-sm bg-primary-500 text-light-1"
      >
        View
      </Button>
    </article>
  )
}

export default UserCard
