import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { api } from '@renderer/utils/api'
import { SchemaNode, SchemaNodeType } from './db-schema.types'
import SchemaTreeItem from './schema-tree-item'
import { ConnectionProfile } from '../../../types/database'

// API 응답 타입을 위한 인터페이스 정의
interface ApiResponse<T> {
  code: string
  message: string
  data: T
}

interface ColumnInfo {
  name: string
}

interface TableInfo {
  name: string
  columns: ColumnInfo[]
}

interface SchemaInfo {
  schema_name: string
  tables: TableInfo[]
}

interface DbInfo {
  db_name: string
  schemas: SchemaInfo[]
}

const initializeExpandedState = (nodes: SchemaNode[]): Record<string, boolean> => {
  let state: Record<string, boolean> = {}
  nodes.forEach((node) => {
    state[node.id] = true
    if (node.children) {
      state = { ...state, ...initializeExpandedState(node.children) }
    }
  })
  return state
}

interface DbSchemaPanelProps {
  profiles: ConnectionProfile[]
  isLoading: boolean
}

/**
 * @author nahyeongjin1
 * @summary DB 스키마 정보를 보여주는 패널
 * @returns JSX.Element
 */
export default function DbSchemaPanel({
  profiles,
  isLoading: isLoadingProfiles
}: DbSchemaPanelProps): React.JSX.Element {
  const [schemaData, setSchemaData] = useState<SchemaNode[]>([])
  const [isSchemaLoading, setIsSchemaLoading] = useState(true)
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({})

  useEffect(() => {
    // profiles가 비어있거나 로딩 중이면 아무것도 하지 않음
    if (isLoadingProfiles || profiles.length === 0) {
      if (!isLoadingProfiles) setIsSchemaLoading(false)
      return
    }

    const fetchSchemaData = async (): Promise<void> => {
      try {
        console.log('[DbSchemaPanel] 받은 profiles로 스키마 정보 조회를 시작합니다:', profiles)
        const allSchemasPromises = profiles.map((profile) =>
          api.get(`/api/user/db/find/hierarchical-schema/${profile.id}`)
        )
        const allSchemasRes = (await Promise.all(allSchemasPromises)) as unknown as ApiResponse<
          DbInfo[]
        >[]

        const transformedData = profiles
          .map((profile, index) => {
            const response = allSchemasRes[index]

            if (
              response.code !== '2000' ||
              !response.data ||
              !Array.isArray(response.data) ||
              response.data.length === 0
            ) {
              console.warn(
                `[DbSchemaPanel] 스키마 조회 실패 ${profile.view_name}: ${response.message || 'Empty data'}`
              )
              return null
            }

            const dbInfo = response.data[0]
            return {
              id: profile.id,
              name: profile.view_name || dbInfo.db_name || profile.id,
              type: 'database' as SchemaNodeType,
              children: (dbInfo.schemas || []).map((schema) => ({
                id: `${profile.id}-${schema.schema_name}`,
                name: schema.schema_name,
                type: 'schema' as SchemaNodeType,
                children: (schema.tables || []).map((table) => ({
                  id: `${profile.id}-${schema.schema_name}-${table.name}`,
                  name: table.name,
                  type: 'table' as SchemaNodeType,
                  children: (table.columns || []).map((column) => ({
                    id: `${profile.id}-${schema.schema_name}-${table.name}-${column.name}`,
                    name: column.name,
                    type: 'column' as SchemaNodeType
                  }))
                }))
              }))
            }
          })
          .filter(Boolean) as SchemaNode[]
        console.log('[DbSchemaPanel] 스키마 정보 변환 완료:', transformedData)
        setSchemaData(transformedData)
        setExpandedNodes(initializeExpandedState(transformedData))
      } catch (error) {
        toast.error('데이터베이스 스키마 정보를 불러오는 데 실패했습니다.')
        console.error('[DbSchemaPanel] 스키마 정보 조회 실패:', error)
      } finally {
        setIsSchemaLoading(false)
      }
    }

    fetchSchemaData()
  }, [profiles, isLoadingProfiles])

  const handleToggle = (nodeId: string): void => {
    setExpandedNodes((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }))
  }

  if (isLoadingProfiles || isSchemaLoading) {
    return (
      <div className="w-56 h-full p-3 bg-neutral-800 flex items-center justify-center">
        <p className="text-neutral-400 text-sm">로딩 중...</p>
      </div>
    )
  }

  return (
    <div className="w-56 h-full p-3 bg-neutral-800 outline-1 outline-offset-[-1px] outline-neutral-700 flex-col justify-start items-start inline-flex overflow-y-auto">
      {schemaData.map((node) => (
        <SchemaTreeItem
          key={node.id}
          node={node}
          expandedNodes={expandedNodes}
          onToggle={handleToggle}
        />
      ))}
    </div>
  )
}
