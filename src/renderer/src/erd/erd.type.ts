import { RelationshipEdgeData } from '@/components/erd/type'
import { Edge, Node } from '@xyflow/react'

/**
 * TODO: 관계를 보고 동적으로 position 결정하는 함수 제작
 */
export const initialNodes: Node[] = [
  {
    id: 'users',
    type: 'table',
    position: { x: 400, y: 0 },
    data: {
      tableName: 'users',
      columns: [
        {
          name: 'id',
          type: 'BIGINT',
          constraints: ['primary', 'not-null']
        },
        {
          name: 'email',
          type: 'VARCHAR(255)',
          constraints: ['not-null', 'unique']
        },
        {
          name: 'name',
          type: 'VARCHAR(100)',
          constraints: ['not-null']
        },
        {
          name: 'created_at',
          type: 'TIMESTAMP',
          constraints: ['not-null']
        },
        {
          name: 'updated_at',
          type: 'TIMESTAMP',
          constraints: ['nullable']
        }
      ]
    }
  },
  {
    id: 'posts',
    type: 'table',
    position: { x: 800, y: 0 },
    data: {
      tableName: 'posts',
      columns: [
        {
          name: 'id',
          type: 'BIGINT',
          constraints: ['primary', 'not-null']
        },
        {
          name: 'user_id',
          type: 'BIGINT',
          constraints: ['not-null', 'foreign', 'index']
        },
        {
          name: 'title',
          type: 'VARCHAR(255)',
          constraints: ['not-null']
        },
        {
          name: 'content',
          type: 'TEXT',
          constraints: []
        },
        {
          name: 'published',
          type: 'BOOLEAN',
          constraints: ['not-null']
        },
        {
          name: 'created_at',
          type: 'TIMESTAMP',
          constraints: ['not-null']
        },
        {
          name: 'published_at',
          type: 'TIMESTAMP',
          constraints: ['nullable']
        }
      ]
    }
  },
  {
    id: 'comments',
    type: 'table',
    position: { x: 1200, y: 0 },
    data: {
      tableName: 'comments',
      columns: [
        {
          name: 'id',
          type: 'BIGINT',
          constraints: ['primary', 'not-null']
        },
        {
          name: 'post_id',
          type: 'BIGINT',
          constraints: ['not-null', 'foreign', 'index']
        },
        {
          name: 'user_id',
          type: 'BIGINT',
          constraints: ['not-null', 'foreign', 'index']
        },
        {
          name: 'content',
          type: 'TEXT',
          constraints: ['not-null']
        },
        {
          name: 'created_at',
          type: 'TIMESTAMP',
          constraints: ['not-null']
        }
      ]
    }
  },
  {
    id: 'user_profiles',
    type: 'table',
    position: { x: 0, y: 0 },
    data: {
      tableName: 'user_profiles',
      columns: [
        {
          name: 'id',
          type: 'BIGINT',
          constraints: ['primary', 'not-null']
        },
        {
          name: 'user_id',
          type: 'BIGINT',
          constraints: ['not-null', 'foreign', 'unique', 'index']
        },
        {
          name: 'bio',
          type: 'TEXT',
          constraints: ['nullable']
        },
        {
          name: 'avatar_url',
          type: 'VARCHAR(255)',
          constraints: ['nullable']
        }
      ]
    }
  },
  {
    id: 'tags',
    type: 'table',
    position: { x: 0, y: 400 },
    data: {
      tableName: 'tags',
      columns: [
        {
          name: 'id',
          type: 'BIGINT',
          constraints: ['primary', 'not-null']
        },
        {
          name: 'name',
          type: 'VARCHAR(100)',
          constraints: ['not-null', 'unique']
        },
        {
          name: 'color',
          type: 'VARCHAR(7)',
          constraints: ['nullable']
        }
      ]
    }
  },
  {
    id: 'post_tags',
    type: 'table',
    position: { x: 1200, y: 400 },
    data: {
      tableName: 'post_tags',
      columns: [
        {
          name: 'post_id',
          type: 'BIGINT',
          constraints: ['primary', 'not-null', 'foreign', 'index']
        },
        {
          name: 'tag_id',
          type: 'BIGINT',
          constraints: ['primary', 'not-null', 'foreign', 'index']
        },
        {
          name: 'created_at',
          type: 'TIMESTAMP',
          constraints: ['not-null']
        }
      ]
    }
  }
]

export const initialEdges: Edge<RelationshipEdgeData>[] = [
  {
    id: 'users-posts',
    source: 'users',
    sourceHandle: 'right-1',
    target: 'posts',
    targetHandle: 'left-1',
    type: 'relationship',
    data: {
      cardinality: 'ONE_TO_MANY',
      label: 'has many'
    }
  },
  {
    id: 'posts-comments',
    source: 'posts',
    sourceHandle: 'right-1',
    target: 'comments',
    targetHandle: 'left-1',
    type: 'relationship',
    data: {
      cardinality: 'ONE_TO_MANY',
      label: 'has many'
    }
  },
  {
    id: 'user_profiles-users',
    source: 'user_profiles',
    sourceHandle: 'right-1',
    target: 'users',
    targetHandle: 'left-1',
    type: 'relationship',
    data: {
      cardinality: 'ONE_TO_ONE',
      label: 'belongs to'
    }
  },
  {
    id: 'posts-post_tags',
    source: 'posts',
    sourceHandle: 'right-2',
    target: 'post_tags',
    targetHandle: 'left-1',
    type: 'relationship',
    data: {
      cardinality: 'ONE_TO_MANY',
      label: 'has many'
    }
  },
  {
    id: 'tags-post_tags',
    source: 'tags',
    sourceHandle: 'right-1',
    target: 'post_tags',
    targetHandle: 'left-2',
    type: 'relationship',
    data: {
      cardinality: 'ONE_TO_MANY',
      label: 'has many'
    }
  },
  {
    id: 'users-comments',
    source: 'users',
    sourceHandle: 'right-2',
    target: 'comments',
    targetHandle: 'left-2',
    type: 'relationship',
    data: {
      cardinality: 'ONE_TO_MANY',
      label: 'wrote'
    }
  }
]
