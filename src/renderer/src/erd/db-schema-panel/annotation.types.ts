export interface AnnotationNode {
  id: string
  type: 'mysql' | 'sqlite' | 'postgresql' | 'oracle' | 'mariadb'
  host: string
  port: number
  name?: string
  view_name?: string
}

export interface AnnotationItemProps {
  db: AnnotationNode
  index: number
  hasFocus: boolean
  onToggle: (nodeIndex: number) => void
}
