import { useState, useRef, useEffect } from 'react'
import { History, Plus, Pencil, Trash2 } from 'lucide-react'
import { ChatTab } from './ai-chat.types'
import { createChatTab, updateChatTab, deleteChatTab } from '../../../utils/chatApi'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'
import { toast } from 'sonner'

interface ChatHistoryPanelProps {
  onSelectChat: (tab: ChatTab) => void
  chatTabs: ChatTab[]
  refreshChatTabs: () => Promise<void>
}

export default function ChatHistoryPanel({
  onSelectChat,
  chatTabs,
  refreshChatTabs
}: ChatHistoryPanelProps): React.JSX.Element {
  const [editingTabId, setEditingTabId] = useState<string | null>(null)
  const [editingTabName, setEditingTabName] = useState('')
  const editInputRef = useRef<HTMLInputElement>(null)

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
        await refreshChatTabs()
        onSelectChat(response.data)
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
    if (!editingTabName.trim()) {
      setEditingTabId(null)
      return
    }

    try {
      await updateChatTab(tabId, editingTabName)
      setEditingTabId(null)
      toast.success('채팅 이름이 수정되었습니다.')
      await refreshChatTabs()
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
        await refreshChatTabs()
      } catch (error) {
        console.error('채팅 탭 삭제에 실패했습니다:', error)
        toast.error('채팅 삭제에 실패했습니다.')
      }
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
        {chatTabs.map((chat) => (
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
                  onClick={() => onSelectChat(chat)}
                  className="text-genie-100 text-body font-pretendard truncate cursor-pointer flex-1"
                >
                  {chat.name}
                </p>
                <div className="hidden group-hover:flex items-center gap-2 ml-2">
                  <Pencil
                    className="size-4 text-gray-400 hover:stroke-white cursor-pointer"
                    onClick={() => handleEditClick(chat)}
                  />
                  <Trash2
                    className="size-4 text-gray-400 hover:stroke-red-500 cursor-pointer"
                    onClick={() => handleDeleteClick(chat.id)}
                  />
                </div>
                <p className="text-genie-500 text-body font-pretendard flex-shrink-0 group-hover:hidden">
                  {formatRelativeTime(chat.updated_at)}
                </p>
              </>
            )}
          </div>
        ))}
      </div>
      <div className="w-full flex justify-end">
        <button
          onClick={handleNewChat}
          className="w-21 flex items-center justify-between outline outline-offset-[-1] outline-white/20 gap-2 py-1.5 px-3 rounded-lg bg-gradient-genie-primary hover:cursor-pointer"
        >
          <Plus className="size-4 stroke-genie-100" />
          <p className="text-button font-pretendard text-genie-100">새 채팅</p>
        </button>
      </div>
    </div>
  )
}
