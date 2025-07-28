import { SchemaNode } from './db-schema.types'
import SchemaTreeItem from './schema-tree-item'

// TODO: 추후 API 연동을 통해 실제 DB 스키마 데이터로 교체
const MOCK_SCHEMA_DATA: SchemaNode[] = [
  {
    id: 'db-1',
    name: 'DEMO_DATA',
    type: 'database',
    children: [
      {
        id: 'schema-1',
        name: 'INFORMATION_SCHEMA',
        type: 'schema',
        children: [
          {
            id: 'folder-1',
            name: 'tables',
            type: 'folder',
            children: [
              { id: 'table-1', name: 'ITEM', type: 'table' },
              { id: 'table-2', name: 'CUSTOMER', type: 'table' },
              { id: 'table-3', name: 'ORDERS', type: 'table' },
              { id: 'table-4', name: 'PRODUCT', type: 'table' },
              { id: 'table-5', name: 'SALES', type: 'table' },
              { id: 'table-6', name: 'EMPLOYEE', type: 'table' }
            ]
          }
        ]
      }
    ]
  }
]

/**
 * @author nahyeongjin1
 * @summary DB 스키마 정보를 보여주는 패널
 * @returns JSX.Element
 */
export default function DbSchemaPanel(): React.JSX.Element {
  return (
    <div className="w-56 h-full p-3 bg-neutral-800 outline-1 outline-offset-[-1px] outline-neutral-700 flex-col justify-start items-start inline-flex">
      {MOCK_SCHEMA_DATA.map((node) => (
        <SchemaTreeItem key={node.id} node={node} />
      ))}
    </div>
  )
}
