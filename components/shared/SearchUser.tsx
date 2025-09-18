'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Input } from '../ui/input'

interface Props {
  routeType: string
}

function Searchbar({ routeType }: Props) {
  const router = useRouter()
  const [search, setSearch] = useState('')

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search) {
        router.push(`/${routeType}?q=` + search)
      } else {
        router.push(`/${routeType}`)
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [search, routeType])

  return (
    <div className="relative w-full h-10">
      <Image
        src="/search-gray.svg"
        alt="search"
        width={18}
        height={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <Input
        id="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder={`${routeType !== '/search' ? 'Search communities' : 'Search creators'}`}
        className="pl-10 pr-4 bg-light-1 w-full"
      />
    </div>
  )
}

export default Searchbar
