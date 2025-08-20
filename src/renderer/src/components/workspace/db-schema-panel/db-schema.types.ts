import { LucideIcon } from 'lucide-react'

export type SchemaNodeType = 'database' | 'schema' | 'table' | 'column'

export interface SchemaNode {
  id: string
  name: string
  type: SchemaNodeType
  children?: SchemaNode[]
}

export interface SchemaTreeItemProps {
  node: SchemaNode
  level?: number
  expandedNodes: Record<string, boolean>
  onToggle: (nodeId: string) => void
}

export interface SchemaIconMap {
  database: LucideIcon
  schema: LucideIcon
  table: LucideIcon
  column: LucideIcon
}
