import { useEffect, useState, useRef } from 'react'
import { History, Plus, Pencil, Trash2 } from 'lucide-react'
import { ChatTab } from './ai-chat.types'
import { getChatTabs, createChatTab, updateChatTab, deleteChatTab } from '../../../utils/chatApi'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'
import { toast } from 'sonner'

interface ChatHistoryPanelProps {
  onSelectChat: (tabId: string) => void
}

export default function ChatHistoryPanel({
  onSelectChat
}: ChatHistoryPanelProps): React.JSX.Element {
  const [chatTabs, setChatTabs] = useState<ChatTab[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [editingTabId, setEditingTabId] = useState<string | null>(null)
  const [editingTabName, setEditingTabName] = useState('')
  const editInputRef = useRef<HTMLInputElement>(null)

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
      toast.error('채팅 내역을 불러오는 데 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void fetchChatTabs()
  }, [])

  useEffect(() => {
    if (editingTabId && editInputRef.current) {
      editInputRef.current.focus()
    }
  }, [editingTabId])

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
      toast.error('새 채팅을 생성하는 데 실패했습니다.')
    }
  }

  const handleEditClick = (tab: ChatTab): void => {
    setEditingTabId(tab.id)
    setEditingTabName(tab.name)
  }

  const handleUpdateSubmit = async (e: React.FormEvent, tabId: string): Promise<void> => {
    e.preventDefault()
    if (!editingTabName.trim()) return

    try {
      await updateChatTab(tabId, editingTabName)
      setEditingTabId(null)
      toast.success('채팅 이름이 수정되었습니다.')
      await fetchChatTabs()
    } catch (error) {
      console.error('채팅 탭 이름 수정에 실패했습니다:', error)
      toast.error('채팅 이름 수정에 실패했습니다.')
    }
  }

  const handleDeleteClick = async (tabId: string): Promise<void> => {
    if (window.confirm('정말로 이 채팅을 삭제하시겠습니까?')) {
      try {
        await deleteChatTab(tabId)
        toast.success('채팅이 삭제되었습니다.')
        await fetchChatTabs()
        // TODO: 만약 현재 활성화된 탭이 삭제되었다면, 다른 탭을 선택하거나 초기화하는 로직 필요
      } catch (error) {
        console.error('채팅 탭 삭제에 실패했습니다:', error)
        toast.error('채팅 삭제에 실패했습니다.')
      }
    }
  }

  const formatRelativeTime = (dateString: string): string => {
    // 서버에서 오는 시간 값에 'Z'가 없을 경우, UTC 시간으로 인식하도록 'Z'를 추가합니다.
    const date = new Date(dateString.endsWith('Z') ? dateString : `${dateString}Z`)
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
              className="p-2 rounded-lg hover:bg-neutral-700 flex justify-between items-center group"
            >
              {editingTabId === chat.id ? (
                <form onSubmit={(e) => handleUpdateSubmit(e, chat.id)} className="flex-1">
                  <input
                    ref={editInputRef}
                    type="text"
                    value={editingTabName}
                    onChange={(e) => setEditingTabName(e.target.value)}
                    onBlur={(e) => handleUpdateSubmit(e, chat.id)}
                    className="bg-transparent text-genie-100 text-body font-pretendard w-full focus:outline-none"
                  />
                </form>
              ) : (
                <>
                  <p
                    onClick={() => onSelectChat(chat.id)}
                    className="text-genie-100 text-body font-pretendard truncate cursor-pointer flex-1"
                  >
                    {chat.name}
                  </p>
                  <div className="hidden group-hover:flex items-center gap-2 ml-2">
                    <Pencil
                      className="size-4 text-gray-400 hover:text-white cursor-pointer"
                      onClick={() => handleEditClick(chat)}
                    />
                    <Trash2
                      className="size-4 text-gray-400 hover:text-red-500 cursor-pointer"
                      onClick={() => handleDeleteClick(chat.id)}
                    />
                  </div>
                  <p className="text-genie-500 text-body font-pretendard flex-shrink-0 group-hover:hidden">
                    {formatRelativeTime(chat.updated_at)}
                  </p>
                </>
              )}
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
