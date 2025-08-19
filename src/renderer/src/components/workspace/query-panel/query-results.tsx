export interface QueryResultData {
  columns: string[]
  rows: (string | number | null)[][]
}

interface QueryResultsProps {
  result: QueryResultData | null
  isLoading: boolean
  error: string | null
}

export default function QueryResults({
  result,
  isLoading,
  error
}: QueryResultsProps): React.JSX.Element {
  const hasResults = result && result.columns.length > 0

  const renderContent = (): React.ReactNode => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full text-neutral-400">
          쿼리를 실행 중입니다...
        </div>
      )
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-full text-red-500">오류: {error}</div>
      )
    }

    if (hasResults) {
      return (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-neutral-700">
              <tr>
                {result.columns.map((column) => (
                  <th
                    key={column}
                    scope="col"
                    className="px-4 py-2 text-left text-xs font-medium text-neutral-200 tracking-wider"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.rows.length > 0 ? (
                result.rows.map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-b border-neutral-700">
                    {row.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        className="px-4 py-2 whitespace-nowrap text-sm text-neutral-200"
                      >
                        {String(cell)}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={result.columns.length}
                    className="text-center py-4 text-sm text-neutral-400"
                  >
                    쿼리는 성공했지만 반환된 행이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )
    }

    return (
      <div className="flex items-center justify-center h-full text-neutral-500">
        쿼리를 실행하여 결과를 확인하세요.
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="flex-1 p-5 overflow-auto">{renderContent()}</div>
    </div>
  )
}
