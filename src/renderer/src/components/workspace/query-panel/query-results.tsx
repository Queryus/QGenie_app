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
  const hasResults = result && result.columns.length > 0 && result.rows

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-neutral-400">
        쿼리를 실행 중입니다...
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="p-4 flex items-center justify-center h-full text-red-500 bg-red-900/20 rounded-md">
          <pre className="whitespace-pre-wrap text-sm">오류: {error}</pre>
        </div>
      </div>
    )
  }

  if (hasResults) {
    return (
      <div className="w-full h-full overflow-auto p-4">
        <table className="min-w-full divide-y divide-neutral-700">
          <thead className="bg-neutral-700/50 sticky top-0">
            <tr>
              {result.columns.map((column) => (
                <th
                  key={column}
                  scope="col"
                  className="px-4 py-2 text-left text-xs font-medium text-neutral-300 tracking-wider whitespace-nowrap"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-neutral-800 divide-y divide-neutral-700">
            {result.rows.length > 0 ? (
              result.rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-neutral-700/50">
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="px-4 py-2 whitespace-nowrap text-sm text-neutral-200"
                    >
                      {cell === null ? (
                        <span className="text-neutral-500">NULL</span>
                      ) : (
                        String(cell)
                      )}
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
