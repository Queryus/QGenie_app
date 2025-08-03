/**
 * @author nahyeongjin1
 * @summary 쿼리 편집기 패널
 * @returns JSX.Element
 */
export default function QueryEditor(): React.JSX.Element {
  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="flex-1 p-5 overflow-auto">
        <div className="justify-start text-genie-100 font-code leading-tight">
          SELECT p.ProductName, SUM(sod.sales_quantity) as total_quantity_sold,
          SUM(sod.sales_quantity * sod.UnitPrice) as total_revenue FROM Products p JOIN
          SalesOrderDetails sod ON p.ProductID = sod.ProductID GROUP BY p.ProductID, p.ProductName
          ORDER BY total_revenue DESC LIMIT 5;
        </div>
      </div>
    </div>
  )
}
