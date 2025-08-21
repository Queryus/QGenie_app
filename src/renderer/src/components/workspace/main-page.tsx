import { useEffect, useState } from 'react'
import { Sidebar } from '../layout/side-bar'
import WorkSpace from './workspace'
import { WorkspaceEmptyState } from './workspace-empty-state'
import { ConnectionProfile } from '@renderer/types/database'
import { ApiResponse } from '@renderer/types'
import { api } from '@renderer/utils/api'
import { toast } from 'sonner'

export function MainPage(): React.JSX.Element {
  const [connections, setConnections] = useState<ConnectionProfile[]>([])

  useEffect(() => {
    const checkConnections = async (): Promise<void> => {
      try {
        const res = await api.get<ApiResponse<ConnectionProfile[]>>('/api/user/db/find/all')
        if (res && Array.isArray(res.data)) {
          setConnections(res.data)
        } else {
          throw new Error('Invalid API response format')
        }
      } catch (error) {
        toast.error('DB 연결 목록을 불러오는 데 실패했습니다.')
        console.error('[MainPage] DB 연결 목록 조회 실패:', error)
      }
    }
    checkConnections()
  }, [])

  return (
    <div className="w-screen h-screen bg-zinc-900 flex overflow-hidden">
      <Sidebar hasConnections={connections.length > 0} />
      {connections.length > 0 ? <WorkSpace connections={connections} /> : <WorkspaceEmptyState />}
    </div>
  )
}
