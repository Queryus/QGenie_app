import { useState } from 'react'
import { BotMessageSquare, History } from 'lucide-react'
import SearchBar from './search-bar'
import ChatHistoryPanel from './chat-history-panel'

interface ChatHeaderProps {
  onSearchChange: (term: string) => void
}

/**
 * @author nahyeongjin1
 * @summary AI 채팅 패널의 헤더
 * @param onSearchChange 검색어가 변경될 때 호출되는 콜백 함수
 * @returns JSX.Element
 */
export default function ChatHeader({ onSearchChange }: ChatHeaderProps): React.JSX.Element {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)

  const toggleHistory = (): void => {
    setIsHistoryOpen((prev) => !prev)
  }

  return (
    <div className="self-stretch pl-4 pr-3 py-3 bg-neutral-800 border-b border-neutral-700 inline-flex justify-between items-center">
      <div className="flex justify-start items-center gap-2">
        <BotMessageSquare className="size-4 stroke-[#E4E4E4]" />
        <div className="justify-start text-neutral-200 text-sm font-bold font-['Pretendard'] leading-tight">
          AI 채팅
        </div>
      </div>
      <div className="flex justify-start items-center gap-4">
        <SearchBar onSearchChange={onSearchChange} />
        <div className="relative flex">
          <button onClick={toggleHistory} className="focus:outline-none">
            <History className="size-4 stroke-[#E4E4E4] cursor-pointer" />
          </button>
          {isHistoryOpen && <ChatHistoryPanel />}
        </div>
      </div>
    </div>
  )
}
