import { useState } from 'react'

/**
 * @author nahyeongjin1
 * @summary 쿼리 편집기 패널
 * @returns JSX.Element
 */
export default function QueryEditor(): React.JSX.Element {
  const [query, setQuery] = useState(
    'SELECT p.ProductName, SUM(sod.sales_quantity) as total_quantity_sold, ' +
      'SUM(sod.sales_quantity * sod.UnitPrice) as total_revenue ' +
      'FROM Products p ' +
      'JOIN SalesOrderDetails sod ON p.ProductID = sod.ProductID ' +
      'GROUP BY p.ProductID, p.ProductName ' +
      'ORDER BY total_revenue DESC ' +
      'LIMIT 5;'
  )

  return (
    <div className="h-full p-5">
      <textarea
        name="query"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full h-full bg-transparent text-genie-100 font-code text-code resize-none focus:outline-none"
        spellCheck="false"
      />
    </div>
  )
}
