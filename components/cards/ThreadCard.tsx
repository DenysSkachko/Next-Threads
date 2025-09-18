import { formatDateString } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import DeleteThread from '../forms/DeleteThread'

interface ThreadCardProps {
  id: string
  currentUserId: string
  parentId: string | null
  content: string
  author: {
    name: string
    image: string
    id: string
  }
  community: {
    id: string
    name: string
    image: string | null
  }
  createdAt: string
  comments: {
    author: {
      image: string
    }
  }[]
  isComment?: boolean
}

const ThreadCard = ({
  id,
  currentUserId,
  parentId,
  content,
  author,
  community,
  createdAt,
  comments,
  isComment,
}: ThreadCardProps) => {
  return (
    <article
      className={`flex w-full flex-col rounded-xl ${
        isComment ? 'px-0 xs:px-7  ' : 'bg-light-2  p-7'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex w-full flex-1 gap-4">
          <div className="flex flex-col items-center">
            <Link href={`/profile/${author.id}`} className="relative h-11 w-11">
              <Image
                src={author.image}
                alt="Profile image"
                fill
                className="cursor-pointer rounded-full"
              />
            </Link>
          </div>

          <div
            className={`flex w-full flex-col ${
              isComment ? 'bg-dark-2 rounded-lg px-4 py-4 text-light-1' : 'text-dark-2'
            }`}
          >
            <Link href={`/profile/${author.id}`} className="w-fit">
              <h4 className="cursor-pointer text-base-semibold">{author.name}</h4>
            </Link>

            <p className="mt-2 text-small-regular">{content}</p>

            <div className="mt-5 flex flex-col gap-3">
              <div className="flex gap-3.5">
                <Image
                  src="/heart-gray.svg"
                  alt="heart"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />
                <Link href={`/thread/${id}`}>
                  <Image
                    src="/reply.svg"
                    alt="reply"
                    width={24}
                    height={24}
                    className="cursor-pointer object-contain"
                  />
                </Link>

                <DeleteThread
                  threadId={JSON.stringify(id)}
                  currentUserId={currentUserId}
                  authorId={author.id}
                  parentId={parentId}
                  isComment={isComment}
                />

                {comments.length > 0 && (
                  <Link href={`/thread/${id}`} className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {comments
                        .map(c => c.author.image)
                        .filter((v, i, arr) => arr.indexOf(v) === i)
                        .slice(0, 3)
                        .map((img, idx) => (
                          <Image
                            key={idx}
                            src={img}
                            alt="commenter"
                            width={24}
                            height={24}
                            className="rounded-full border border-light-2"
                          />
                        ))}
                    </div>

                    <p className="text-subtle-medium text-gray-1">{comments.length} comments</p>
                  </Link>
                )}
              </div>

              <p className="text-subtle-medium text-gray-1 flex items-center gap-1 mt-1">
                <span>{formatDateString(createdAt)}</span>

                {!isComment && community && (
                  <Link
                    href={`/communities/${community.id}`}
                    className="flex items-center gap-1 text-dark-4 font-medium"
                  >
                    <span>- {community.name}</span>
                  </Link>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

export default ThreadCard
