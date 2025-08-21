import { useEffect, useState } from 'react'
import { DbSchemaPanel } from './db-schema-panel'
import { AiChatPanel } from './ai-chat-panel'
import { QueryPanel } from './query-panel'
import { api } from '@renderer/utils/api'
import { toast } from 'sonner'
import { ConnectionProfile } from '@renderer/types/database'
import { ApiResponse } from '@renderer/types'

const WorkSpace = (): React.JSX.Element => {
  const [connections, setConnections] = useState<ConnectionProfile[]>([])
  const [activeConnection, setActiveConnection] = useState<ConnectionProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchConnections = async (): Promise<void> => {
      try {
        console.log('[Workspace] DB 연결 목록 조회를 시작합니다.')
        const res = await api.get<ApiResponse<ConnectionProfile[]>>('/api/user/db/find/all')
        console.log('[Workspace] Raw API response:', res)

        if (res && Array.isArray(res.data)) {
          const fetchedConnections = res.data
          console.log('[Workspace] DB 연결 목록 조회 성공:', fetchedConnections)
          setConnections(fetchedConnections)

          if (fetchedConnections.length > 0) {
            console.log('[Workspace] 첫 번째 연결을 활성 DB로 설정합니다:', fetchedConnections[0])
            setActiveConnection(fetchedConnections[0])
          } else {
            console.log('[Workspace] 저장된 DB 연결이 없습니다.')
          }
        } else {
          throw new Error('Invalid API response format')
        }
      } catch (error) {
        toast.error('DB 연결 목록을 불러오는 데 실패했습니다.')
        console.error('[Workspace] DB 연결 목록 조회 실패:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchConnections()
  }, [])

  return (
    <main className="flex flex-1 h-full bg-zinc-900 pt-2 pr-2 pb-2">
      {/* DB Schema Panel (Left) */}
      <DbSchemaPanel profiles={connections} isLoading={isLoading} />

      {/* Main Content (Center & Right) */}
      <div className="grid grid-cols-2 flex-1 h-full ml-2 gap-2">
        {/* AI Chat Panel (Center) */}
        <div className="min-w-0 flex">
          <AiChatPanel />
        </div>

        {/* Query & Results Panel (Right) */}
        <div className="min-w-0 flex">
          <QueryPanel
            connections={connections}
            activeConnection={activeConnection}
            setActiveConnection={setActiveConnection}
          />
        </div>
      </div>
    </main>
  )
}

export default WorkSpace
