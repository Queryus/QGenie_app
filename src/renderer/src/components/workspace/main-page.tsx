import { useEffect, useState, useCallback } from 'react'
import { Sidebar } from '../layout/side-bar'
import WorkSpace from './workspace'
import { WorkspaceEmptyState } from './workspace-empty-state'
import { ConnectionProfile } from '@renderer/types/database'
import { ApiResponse } from '@renderer/types'
import { api } from '@renderer/utils/api'
import { toast } from 'sonner'

export function MainPage(): React.JSX.Element {
  const [connections, setConnections] = useState<ConnectionProfile[]>([])

  const checkConnections = useCallback(async (): Promise<void> => {
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
  }, [])

  useEffect(() => {
    checkConnections()

    // connections-updated 신호를 수신하여 연결 목록을 다시 불러옵니다.
    const unsubscribe = window.electron.ipcRenderer.on('connections-updated', () => {
      console.log('[MainPage] Received connections-updated signal. Refetching connections...')
      checkConnections()
    })

    // 컴포넌트가 언마운트될 때 리스너를 정리합니다.
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe()
      }
    }
  }, [checkConnections])

  return (
    <div className="w-screen h-screen bg-zinc-900 flex overflow-hidden">
      <Sidebar hasConnections={connections.length > 0} />
      {connections.length > 0 ? <WorkSpace connections={connections} /> : <WorkspaceEmptyState />}
    </div>
  )
}
