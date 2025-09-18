'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

interface SearchBarProps {
  onSearch: (query: string) => void
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    onSearch(value)
  }

  return (
    <div className="relative w-full">
      <Input
        type="text"
        placeholder="Search threads, authors, communities..."
        value={query}
        onChange={handleChange} 
        className="pl-10 pr-4 bg-light-1 w-full"
      />
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
    </div>
  )
}

export default SearchBar
