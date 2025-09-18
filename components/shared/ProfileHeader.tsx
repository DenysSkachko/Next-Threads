import Image from 'next/image'
import Link from 'next/link'

interface ProfileProps {
  accountId: string
  authUserId: string
  name: string
  username: string
  imgUrl: string
  bio: string
  type?: 'User' | 'Community'
}

const ProfileHeader = ({ accountId, authUserId, name, username, imgUrl, bio, type }: ProfileProps) => {
  return (
    <div className="flex flex-col justify-start w-full bg-dark-2 rounded-lg p-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-20 w-20 object-cover">
            <Image
              src={imgUrl}
              alt="Profile Image"
              fill
              className="rounded-full object-contain shadow-2xl"
            />
          </div>

          <div className="flex-1">
            <h2 className="text-left text-light-1 text-heading3-bold">{name}</h2>
            <p className="text-base-medium text-gray-1">@{username}</p>
          </div>
        </div>

        {accountId === authUserId && type !== 'Community' && (
          <Link href="/profile/edit">
            <div className="flex cursor-pointer gap-3 rounded-lg bg-gray-1 px-4 py-2">
              <Image src="/edit.svg" alt="logout" width={16} height={16} />

              <p className="text-dark-2 max-sm:hidden">Edit</p>
            </div>
          </Link>
        )}
      </div>
      <p className="mt-6 max-w-lg text-base-regular text-gray-1">{bio}</p>
    </div>
  )
}

export default ProfileHeader
