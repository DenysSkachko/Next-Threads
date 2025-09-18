'use client'

import { useState, useRef, useEffect } from 'react'
import SearchBar from './SearchBar'
import Link from 'next/link'
import Image from 'next/image'

interface SearchWrapperProps {
  posts: any[]
  currentUserId: string
}

const SearchWrapper = ({ posts }: SearchWrapperProps) => {
  const [query, setQuery] = useState('')
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setQuery('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const filteredPosts = posts.filter(post => {
    if (!query.trim()) return false

    const q = query.toLowerCase()
    const textMatch = post.text?.toLowerCase().includes(q)
    const authorMatch = post.author?.name?.toLowerCase().includes(q)
    const communityMatch = post.community?.name?.toLowerCase().includes(q)
    return textMatch || authorMatch || communityMatch
  })

  return (
    <div ref={wrapperRef} className="w-full relative flex-1">
      <SearchBar onSearch={setQuery} />

      {query.trim() !== '' && (
        <div className="absolute top-12 left-0 w-full bg-white dark:bg-dark-2 rounded-xl shadow-xl z-50">
          {filteredPosts.length > 0 ? (
            <ul className="flex flex-col max-h-72 overflow-y-auto">
              {filteredPosts.map((post, idx) => {
                const isFirst = idx === 0
                const isLast = idx === filteredPosts.length - 1
                return (
                  <li key={post._id}>
                    <Link
                      href={`/thread/${post._id}`}
                      onClick={() => setQuery('')}
                      className={`flex items-center gap-3 p-3 hover:bg-light-2
                        ${isFirst ? 'rounded-t-xl' : ''} 
                        ${isLast ? 'rounded-b-xl' : ''}`}
                    >
                      <Image
                        src={post.author?.image || '/default-avatar.png'}
                        alt={post.author?.name || 'User'}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                      <div className="flex flex-col">
                        <p className="text-sm font-medium text-dark-1 line-clamp-1">{post.text}</p>
                        <span className="text-xs text-gray-500">
                          {post.author?.name}
                          {post.community?.name ? ` • ${post.community.name}` : ''}
                        </span>
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="p-3 text-sm text-gray-500">No results found</p>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchWrapper
