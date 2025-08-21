import { useEffect, useState } from 'react'
import { DbSchemaPanel } from './db-schema-panel'
import { AiChatPanel } from './ai-chat-panel'
import { QueryPanel, type QueryResultData, type ActiveTab } from './query-panel'
import { api } from '@renderer/utils/api'
import { toast } from 'sonner'
import { ConnectionProfile } from '@renderer/types/database'
import { ApiResponse } from '@renderer/types'

// API 응답 타입을 Workspace 레벨에서 정의합니다.
interface QueryApiResponse {
  data: {
    columns: string[]
    data: Record<string, string | number | null>[]
  }
}

const WorkSpace = (): React.JSX.Element => {
  // --- 기존 상태 ---
  const [connections, setConnections] = useState<ConnectionProfile[]>([])
  const [activeConnection, setActiveConnection] = useState<ConnectionProfile | null>(null)
  const [isConnectionLoading, setIsConnectionLoading] = useState(true)

  // --- QueryPanel로부터 이동된 상태 ---
  const [query, setQuery] = useState(
    'SELECT p.ProductName, SUM(sod.sales_quantity) as total_quantity_sold, SUM(sod.sales_quantity * sod.UnitPrice) as total_revenue FROM Products p JOIN SalesOrderDetails sod ON p.ProductID = sod.ProductID GROUP BY p.ProductID, p.ProductName ORDER BY total_revenue DESC LIMIT 5;'
  )
  const [result, setResult] = useState<QueryResultData | null>(null)
  const [isQueryLoading, setIsQueryLoading] = useState(false)
  const [queryError, setQueryError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<ActiveTab>('editor')

  useEffect(() => {
    const fetchConnections = async (): Promise<void> => {
      try {
        const res = await api.get<ApiResponse<ConnectionProfile[]>>('/api/user/db/find/all')
        if (res && Array.isArray(res.data)) {
          const fetchedConnections = res.data
          setConnections(fetchedConnections)
          if (fetchedConnections.length > 0) {
            setActiveConnection(fetchedConnections[0])
          }
        } else {
          throw new Error('Invalid API response format')
        }
      } catch (error) {
        toast.error('DB 연결 목록을 불러오는 데 실패했습니다.')
        console.error('[Workspace] DB 연결 목록 조회 실패:', error)
      } finally {
        setIsConnectionLoading(false)
      }
    }
    fetchConnections()
  }, [])

  // --- QueryPanel로부터 이동된 쿼리 실행 함수 ---
  const handleExecuteQuery = async (
    queryToExecute: string,
    chatMessageId?: string
  ): Promise<void> => {
    if (!activeConnection) {
      toast.error('쿼리를 실행할 데이터베이스를 선택해주세요.')
      return
    }

    setIsQueryLoading(true)
    setQueryError(null)

    const endpoint = chatMessageId ? '/api/query/execute' : '/api/query/execute/test'
    const requestBody = {
      user_db_id: activeConnection.id,
      database: activeConnection.name,
      query_text: queryToExecute,
      ...(chatMessageId && { chat_message_id: chatMessageId })
    }

    try {
      const response = (await api.post(endpoint, requestBody)) as QueryApiResponse
      const { columns, data: rowsAsObjects } = response.data
      const rowsAsArrays = rowsAsObjects.map((rowObject) =>
        columns.map((columnName) => rowObject[columnName])
      )
      setResult({ columns, rows: rowsAsArrays })
      setActiveTab('results')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.'
      setQueryError(errorMessage)
      setResult(null)
      setActiveTab('results')
    } finally {
      setIsQueryLoading(false)
    }
  }

  // --- AI 채팅 패널에서 호출할 함수 ---
  const handleAiQueryExecute = (sql: string, chatMessageId: string): void => {
    setQuery(sql) // 쿼리 편집기 내용 업데이트
    handleExecuteQuery(sql, chatMessageId) // 쿼리 실행
  }

  return (
    <main className="flex flex-1 h-full bg-zinc-900 pt-2 pr-2 pb-2">
      <DbSchemaPanel profiles={connections} isLoading={isConnectionLoading} />
      <div className="grid grid-cols-2 flex-1 h-full ml-2 gap-2">
        <div className="min-w-0 flex">
          <AiChatPanel onExecuteQuery={handleAiQueryExecute} />
        </div>
        <div className="min-w-0 flex">
          <QueryPanel
            // Connection state
            connections={connections}
            activeConnection={activeConnection}
            setActiveConnection={setActiveConnection}
            // Query state
            query={query}
            setQuery={setQuery}
            result={result}
            isLoading={isQueryLoading}
            error={queryError}
            setError={setQueryError}
            // Tab state
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            // Execution handler
            onExecuteQuery={() => handleExecuteQuery(query)}
          />
        </div>
      </div>
    </main>
  )
}

export default WorkSpace
