'use client'

import Image from 'next/image'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'
import { GrView } from 'react-icons/gr'
import ButtonSmall from '../ui/button-small'

interface UserProps {
  id: string
  name: string
  username: string
  imgUrl: string
  personType: string
}

const UserPreview = ({ id, name, username, imgUrl, personType }: UserProps) => {
  const router = useRouter()

  const isCommunity = personType === 'Community'

  return (
    <article className="user-card">
      <div className="user-card_avatar">
        <Image
          src={imgUrl}
          alt={`${name}'s avatar`}
          width={48}
          height={48}
          className="rounded-full"
        />
        <div className="text-ellipsis">
          <h4 className="text-base-semibold text-light-1">{name}</h4>
          <p className="text-small-medium text-gray-1">@{username}</p>
        </div>
      </div>

      <ButtonSmall
        className="bg-primary-500"
        onClick={() => {
          if (isCommunity) {
            router.push(`/communities/${id}`)
          } else {
            router.push(`/profile/${id}`)
          }
        }}
      >
        <GrView size={25} className="text-light-1" />
      </ButtonSmall>
    </article>
  )
}

export default UserPreview
