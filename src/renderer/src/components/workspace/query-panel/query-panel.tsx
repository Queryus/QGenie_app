import React, { useState } from 'react'
import { Code2, ChartColumn, Download, Play } from 'lucide-react'
import { cn } from '@/lib/utils'
import QueryEditor from './query-editor'
import QueryResults, { type QueryResultData } from './query-results'
import { ConnectionProfile } from '../../../types/database'
import ConnectionSelector from './connection-selector'
import { api } from '@renderer/utils/api'
import { toast } from 'sonner'

type ActiveTab = 'editor' | 'results'

interface QueryPanelProps {
  connections: ConnectionProfile[]
  activeConnection: ConnectionProfile | null
  setActiveConnection: (connection: ConnectionProfile | null) => void
}

// API가 반환하는 실제 데이터 구조에 대한 타입
interface QueryApiResponse {
  data: {
    columns: string[]
    data: Record<string, string | number | null>[] // 객체의 배열
  }
}

/**
 * @author nahyeongjin1
 * @summary 쿼리 편집기 및 결과 탭 패널
 * @returns JSX.Element
 */
export default function QueryPanel({
  connections,
  activeConnection,
  setActiveConnection
}: QueryPanelProps): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<ActiveTab>('editor')
  const [query, setQuery] = useState(
    'SELECT p.ProductName, SUM(sod.sales_quantity) as total_quantity_sold, SUM(sod.sales_quantity * sod.UnitPrice) as total_revenue FROM Products p JOIN SalesOrderDetails sod ON p.ProductID = sod.ProductID GROUP BY p.ProductID, p.ProductName ORDER BY total_revenue DESC LIMIT 5;'
  )
  const [result, setResult] = useState<QueryResultData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleExecuteQuery = async (): Promise<void> => {
    if (!activeConnection) {
      toast.error('쿼리를 실행할 데이터베이스를 선택해주세요.')
      return
    }

    setIsLoading(true)
    setError(null)

    const requestBody = {
      user_db_id: activeConnection.id,
      database: activeConnection.name,
      query_text: query
      // chat_message_id는 현재 컨텍스트에 없으므로 생략하거나 임시 값을 사용합니다.
      // chat_message_id: 'temp-id'
    }

    try {
      console.log('[QueryPanel] 쿼리 실행 요청:', requestBody)
      const response = (await api.post('/api/query/execute/test', requestBody)) as QueryApiResponse
      console.log('[QueryPanel] 쿼리 실행 응답:', response)

      const { columns, data: rowsAsObjects } = response.data

      // API 응답(객체의 배열)을 컴포넌트가 사용할 형태(값 배열의 배열)로 변환합니다.
      const rowsAsArrays = rowsAsObjects.map((rowObject) =>
        columns.map((columnName) => rowObject[columnName])
      )

      const queryResult: QueryResultData = {
        columns: columns,
        rows: rowsAsArrays
      }

      setResult(queryResult)
      setActiveTab('results')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.'
      console.error('[QueryPanel] 쿼리 실행 오류:', errorMessage)
      setError(errorMessage)
      setResult(null)
      setActiveTab('results')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTabChange = (tabName: ActiveTab): void => {
    // '실행 결과' 탭에서 '쿼리 편집기' 탭으로 돌아올 때 에러 상태를 초기화합니다.
    if (tabName === 'editor') {
      setError(null)
    }
    setActiveTab(tabName)
  }

  const TabButton = ({
    tabName,
    Icon,
    label
  }: {
    tabName: ActiveTab
    Icon: React.ElementType
    label: string
  }): React.JSX.Element => (
    <div
      onClick={() => handleTabChange(tabName)}
      className={cn(
        'group flex items-center gap-2 py-[16.5px] cursor-pointer border-b-3 -mb-px',
        activeTab === tabName
          ? 'border-primary-light text-genie-100'
          : 'border-transparent text-genie-500 hover:text-genie-200 hover:opacity-80'
      )}
    >
      <Icon className="size-4 stroke-current" />
      <span className="text-title font-pretendard">{label}</span>
    </div>
  )

  return (
    <div className="w-full h-full grid grid-rows-[auto_1fr] bg-neutral-800 outline-1 outline-offset-[-1px] outline-neutral-700">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-neutral-700 pr-3 pl-4">
        <div className="flex gap-6 px-1">
          <TabButton tabName="editor" Icon={Code2} label="쿼리 편집기" />
          <TabButton tabName="results" Icon={ChartColumn} label="실행 결과" />
        </div>
        <div className="flex items-center gap-2">
          {activeTab == 'editor' ? (
            <button
              onClick={handleExecuteQuery}
              disabled={isLoading || !activeConnection}
              className={cn(
                'flex items-center gap-2 bg-gradient-genie-gray rounded-lg px-3 py-1.5 outline-1 outline-white/20 outline-offset-[-1px]',
                isLoading || !activeConnection ? 'opacity-50' : 'cursor-pointer'
              )}
            >
              <Play className="size-4 stroke-genie-100" />
              <span className="text-button text-genie-100 font-pretendard">
                {isLoading ? '실행 중...' : '실행하기'}
              </span>
            </button>
          ) : (
            <></>
          )}
          <div className="px-3 py-1.5 bg-gradient-genie-primary rounded-lg outline-1 outline-offset-[-1px] outline-white/20 flex justify-center items-center gap-2 cursor-pointer">
            <Download className="size-3 stroke-genie-100" />
            <div className="justify-start text-genie-100 text-button font-pretendard">내보내기</div>
          </div>
        </div>
      </div>
      {/* Content */}
      <div className="overflow-hidden">
        {activeTab === 'editor' && (
          <div className="h-full flex flex-col">
            <div className="p-2 border-b border-neutral-700">
              <ConnectionSelector
                connections={connections}
                activeConnection={activeConnection}
                setActiveConnection={setActiveConnection}
              />
            </div>
            <QueryEditor query={query} setQuery={setQuery} />
          </div>
        )}
        {activeTab === 'results' && (
          <QueryResults result={result} isLoading={isLoading} error={error} />
        )}
      </div>
    </div>
  )
}
