import type { Edge } from '@xyflow/react'

export type RelationshipEdgeData = {
  isHighlighted?: boolean
  cardinality?: 'ONE_TO_ONE' | 'ONE_TO_MANY' | 'MANY_TO_MANY'
  label?: string
}

export type RelationshipEdgeType = Edge<RelationshipEdgeData>
