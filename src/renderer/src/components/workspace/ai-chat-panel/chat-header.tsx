import { useState } from 'react'
import { BotMessageSquare, History } from 'lucide-react'
import SearchBar from './search-bar'
import ChatHistoryPanel from './chat-history-panel'
import { ChatTab } from './ai-chat.types'

interface ChatHeaderProps {
  activeTabName: string
  onSearchChange: (term: string) => void
  onSelectChat: (tab: ChatTab) => void
  chatTabs: ChatTab[]
  refreshChatTabs: () => Promise<void>
}

/**
 * @author nahyeongjin1
 * @summary AI 채팅 패널의 헤더
 * @param onSearchChange 검색어가 변경될 때 호출되는 콜백 함수
 * @returns JSX.Element
 */
export default function ChatHeader({
  activeTabName,
  onSearchChange,
  onSelectChat,
  chatTabs,
  refreshChatTabs
}: ChatHeaderProps): React.JSX.Element {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)

  const toggleHistory = (): void => {
    setIsHistoryOpen((prev) => !prev)
  }

  const handleSelectChat = (tab: ChatTab): void => {
    onSelectChat(tab)
    setIsHistoryOpen(false) // 채팅 선택 후 패널 닫기
  }

  return (
    <div className="self-stretch pl-4 pr-3 py-3 bg-neutral-800 border-b border-neutral-700 inline-flex justify-between items-center">
      <div className="flex justify-start items-center gap-2">
        <BotMessageSquare className="size-4 stroke-[#E4E4E4]" />
        <div
          className="justify-start text-genie-100 text-title font-pretendard truncate"
          title={activeTabName}
        >
          {activeTabName}
        </div>
      </div>
      <div className="flex justify-start items-center gap-4">
        <SearchBar onSearchChange={onSearchChange} />
        <div className="relative flex">
          <button onClick={toggleHistory} className="focus:outline-none">
            <History className="size-4 stroke-[#E4E4E4] cursor-pointer" />
          </button>
          {isHistoryOpen && (
            <ChatHistoryPanel
              onSelectChat={handleSelectChat}
              chatTabs={chatTabs}
              refreshChatTabs={refreshChatTabs}
            />
          )}
        </div>
      </div>
    </div>
  )
}
