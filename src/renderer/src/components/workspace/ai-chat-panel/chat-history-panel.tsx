import { History, Plus } from 'lucide-react'

interface ChatSession {
  id: string
  title: string
  lastUpdated: string
}

const mockChatHistory: ChatSession[] = [
  { id: '1', title: '채팅 타이틀', lastUpdated: '3일 전' },
  { id: '2', title: '채팅 타이틀', lastUpdated: '3일 전' },
  { id: '3', title: '채팅 타이틀', lastUpdated: '3일 전' },
  { id: '4', title: '채팅 타이틀', lastUpdated: '3일 전' },
  { id: '5', title: '채팅 타이틀', lastUpdated: '3일 전' }
]

export default function ChatHistoryPanel(): React.JSX.Element {
  return (
    <div className="absolute top-full right-0 mt-7 w-80 bg-gradient-genie-darkgray border border-border-secondary rounded-lg shadow-lg z-10 p-4 flex flex-col gap-2">
      <div className="flex items-center gap-2.5 pl-2">
        <History className="size-4 stroke-[#E4E4E4]" />
        <h2 className="text-genie-100 text-title font-pretendard">채팅 내역</h2>
      </div>
      <div className="flex-1 flex flex-col gap-1">
        {mockChatHistory.map((chat) => (
          <div
            key={chat.id}
            className="p-2 rounded-lg cursor-pointer hover:bg-neutral-700 flex justify-between items-center"
          >
            <p className="text-genie-100 text-body font-pretendard truncate">{chat.title}</p>
            <p className="text-genie-500 text-body font-pretendard flex-shrink-0">
              {chat.lastUpdated}
            </p>
          </div>
        ))}
      </div>
      <button className="mt-2 w-full flex items-center justify-center gap-2 p-2 rounded-lg bg-[#5F27CD] text-white text-xs font-semibold">
        <Plus className="size-4" /> 새 채팅
      </button>
    </div>
  )
}
