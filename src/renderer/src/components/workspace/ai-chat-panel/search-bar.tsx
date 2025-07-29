import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'

interface SearchBarProps {
  onSearchChange: (term: string) => void
}

/**
 * @author nahyeongjin1
 * @summary 채팅 헤더에 사용되는 검색창 컴포넌트
 * @param onSearchChange 검색어가 변경될 때 호출되는 콜백 함수
 * @returns JSX.Element
 */
export default function SearchBar({ onSearchChange }: SearchBarProps): React.JSX.Element {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value)
    onSearchChange(e.target.value)
  }

  const clearSearch = (): void => {
    setSearchTerm('')
    onSearchChange('')
  }

  return (
    <div
      className={cn(
        'flex h-8 w-40 items-center gap-2 rounded-lg border bg-gradient-to-b from-stone-900 to-neutral-800 px-2 py-1.5 transition-colors duration-150',
        'border-neutral-700 focus-within:border-[#9F73FF]'
      )}
    >
      <div className="flex justify-center items-center">
        <Search className="size-4 flex-shrink-0 stroke-[#808080]" />
        <Input
          type="text"
          placeholder="검색"
          value={searchTerm}
          onChange={handleSearchTermChange}
          className="placeholder:text-xs md:text-xs file:text-xs h-full w-full border-0 bg-transparent py-0 pr-0 pl-1 text-xs text-white outline-none ring-0 placeholder:text-zinc-500 focus:border-0 focus:outline-none focus:ring-0 focus-visible:ring-0"
        />
      </div>
      {searchTerm && (
        <X className="size-4 flex-shrink-0 cursor-pointer stroke-[#808080]" onClick={clearSearch} />
      )}
    </div>
  )
}
