import { LucideIcon } from 'lucide-react'

export type SchemaNodeType = 'database' | 'schema' | 'folder' | 'table'

export interface SchemaNode {
  id: string
  name: string
  type: SchemaNodeType
  children?: SchemaNode[]
}

export interface SchemaTreeItemProps {
  node: SchemaNode
  level?: number
}

export interface SchemaIconMap {
  database: LucideIcon
  schema: LucideIcon
  folder: LucideIcon
  table: LucideIcon
}
