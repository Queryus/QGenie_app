import { useEffect, useState } from 'react'
import { DbSchemaPanel } from './db-schema-panel'
import { AiChatPanel } from './ai-chat-panel'
import { QueryPanel, type QueryResultData, type ActiveTab } from './query-panel'
import { api } from '@renderer/utils/api'
import { toast } from 'sonner'
import { ConnectionProfile } from '@renderer/types/database'

// API 응답 타입을 Workspace 레벨에서 정의합니다.
interface QueryApiResponse {
  data: {
    columns: string[]
    data: Record<string, string | number | null>[]
  }
}

interface WorkSpaceProps {
  connections: ConnectionProfile[]
}

const WorkSpace = ({ connections }: WorkSpaceProps): React.JSX.Element => {
  // --- 상태 관리 ---
  const [activeConnection, setActiveConnection] = useState<ConnectionProfile | null>(null)
  const [query, setQuery] = useState(
    'SELECT p.ProductName, SUM(sod.sales_quantity) as total_quantity_sold, SUM(sod.sales_quantity * sod.UnitPrice) as total_revenue FROM Products p JOIN SalesOrderDetails sod ON p.ProductID = sod.ProductID GROUP BY p.ProductID, p.ProductName ORDER BY total_revenue DESC LIMIT 5;'
  )
  const [result, setResult] = useState<QueryResultData | null>(null)
  const [isQueryLoading, setIsQueryLoading] = useState(false)
  const [queryError, setQueryError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<ActiveTab>('editor')

  // MainPage로부터 받은 connections prop이 변경될 때 activeConnection을 설정합니다.
  useEffect(() => {
    const isActiveConnectionValid = connections.some((c) => c.id === activeConnection?.id)

    if (!isActiveConnectionValid && connections.length > 0) {
      setActiveConnection(connections[0])
    } else if (connections.length === 0) {
      setActiveConnection(null)
    }
  }, [connections, activeConnection])

  // --- 핸들러 ---
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

  const handleAiQueryExecute = (sql: string, chatMessageId: string): void => {
    setQuery(sql)
    handleExecuteQuery(sql, chatMessageId)
  }

  return (
    <main className="flex flex-1 h-full bg-zinc-900 pt-2 pr-2 pb-2">
      <DbSchemaPanel profiles={connections} isLoading={false} />
      <div className="grid grid-cols-2 flex-1 h-full ml-2 gap-2">
        <div className="min-w-0 flex">
          <AiChatPanel onExecuteQuery={handleAiQueryExecute} />
        </div>
        <div className="min-w-0 flex">
          <QueryPanel
            connections={connections}
            activeConnection={activeConnection}
            setActiveConnection={setActiveConnection}
            query={query}
            setQuery={setQuery}
            result={result}
            isLoading={isQueryLoading}
            error={queryError}
            setError={setQueryError}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onExecuteQuery={() => handleExecuteQuery(query)}
          />
        </div>
      </div>
    </main>
  )
}

export default WorkSpace
