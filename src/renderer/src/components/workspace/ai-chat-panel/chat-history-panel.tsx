import { useEffect, useState } from 'react'
import { History, Plus } from 'lucide-react'
import { ChatTab } from './ai-chat.types'
import { getChatTabs, createChatTab } from '../../../utils/chatApi'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'

interface ChatHistoryPanelProps {
  onSelectChat: (tabId: string) => void
}

export default function ChatHistoryPanel({
  onSelectChat
}: ChatHistoryPanelProps): React.JSX.Element {
  const [chatTabs, setChatTabs] = useState<ChatTab[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchChatTabs = async (): Promise<void> => {
    try {
      setIsLoading(true)
      const response = await getChatTabs()
      if (response && response.data) {
        // updated_at 기준으로 최신순 정렬
        const sortedTabs = response.data.sort(
          (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        )
        setChatTabs(sortedTabs)
      }
    } catch (error) {
      console.error('채팅 탭 목록을 불러오는 데 실패했습니다:', error)
      // TODO: 사용자에게 에러 알림 표시
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void fetchChatTabs()
  }, [])

  const handleNewChat = async (): Promise<void> => {
    try {
      const newTabName = `New Chat ${chatTabs.length + 1}`
      const response = await createChatTab(newTabName)
      if (response && response.data) {
        await fetchChatTabs() // 목록 새로고침
        onSelectChat(response.data.id) // 새로 생성된 탭 선택
      }
    } catch (error) {
      console.error('새 채팅을 생성하는 데 실패했습니다:', error)
      // TODO: 사용자에게 에러 알림 표시
    }
  }

  const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString)
    return formatDistanceToNow(date, { addSuffix: true, locale: ko })
  }

  return (
    <div className="absolute top-full right-0 mt-7 w-80 bg-gradient-genie-darkgray border border-border-secondary rounded-lg shadow-lg z-10 p-4 flex flex-col gap-2">
      <div className="flex items-center gap-2.5 pl-2">
        <History className="size-4 stroke-[#E4E4E4]" />
        <h2 className="text-genie-100 text-title font-pretendard">채팅 내역</h2>
      </div>
      <div className="flex-1 flex flex-col gap-1 max-h-80 overflow-y-auto">
        {isLoading ? (
          <p className="text-neutral-400 text-xs text-center">불러오는 중...</p>
        ) : (
          chatTabs.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className="p-2 rounded-lg cursor-pointer hover:bg-neutral-700 flex justify-between items-center"
            >
              <p className="text-genie-100 text-body font-pretendard truncate">{chat.name}</p>
              <p className="text-genie-500 text-body font-pretendard flex-shrink-0">
                {formatRelativeTime(chat.updated_at)}
              </p>
            </div>
          ))
        )}
      </div>
      <div className="w-full flex justify-end">
        <button
          onClick={handleNewChat}
          className="w-21 flex items-center justify-between gap-2 py-1.5 px-3 rounded-lg bg-gradient-genie-primary hover:cursor-pointer"
        >
          <Plus className="size-4 stroke-genie-100" />
          <p className="text-button font-pretendard text-genie-100">새 채팅</p>
        </button>
      </div>
    </div>
  )
}
