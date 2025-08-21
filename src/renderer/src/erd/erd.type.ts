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
          constraints: ['primary', 'not-null'],
          description: '사용자 고유 아이디'
        },
        {
          name: 'email',
          type: 'VARCHAR(255)',
          constraints: ['not-null', 'unique'],
          description: '가입 시 사용한 이메일 주소'
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
      label: '관계 라벨'
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
      cardinality: 'ONE_TO_MANY'
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
      cardinality: 'ONE_TO_ONE'
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
      cardinality: 'ONE_TO_MANY'
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
      cardinality: 'ONE_TO_MANY'
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
      cardinality: 'ONE_TO_MANY'
    }
  }
]

export const TEST_ANNOTATION = {
  id: 'DB-ANNO-0A72DC38374B464BAD9481B8BB7696D7',
  created_at: '2025-08-19T09:26:55.081164',
  updated_at: '2025-08-19T09:26:55.081164',
  db_profile_id: 'USER-DB-AD661F6F1D714124851DB65A8014F435',
  database_name: 'postgres',
  description: "Mock: 'postgres' 데이터베이스 전체에 대한 설명입니다.",
  tables: [
    {
      id: 'TBL-ANNO-D8BFC65CDCF64691A1381C5DB20C7C7A',
      created_at: '2025-08-19T09:26:55.081164',
      updated_at: '2025-08-19T09:26:55.081164',
      table_name: 'departments',
      description: "Mock: 'departments' 테이블에 대한 설명입니다.",
      columns: [
        {
          id: 'COL-ANNO-657A7E4819AC4B4984A02AB7D285CA2F',
          column_name: 'department_id',
          description: "Mock: 'department_id' 컬럼에 대한 설명입니다.",
          data_type: 'int4',
          is_nullable: false,
          default_value: "nextval('departments_department_id_seq'::regclass)"
        },
        {
          id: 'COL-ANNO-53945D0E42EE4820AB81A6E510FF1B40',
          column_name: 'department_name',
          description: "Mock: 'department_name' 컬럼에 대한 설명입니다.",
          data_type: 'varchar',
          is_nullable: false,
          default_value: null
        }
      ],
      constraints: [
        {
          name: 'departments_pkey',
          type: 'PRIMARY KEY',
          columns: ['department_id'],
          description: "Mock: 제약조건 'departments_pkey' 설명."
        },
        {
          name: 'departments_department_name_key',
          type: 'UNIQUE',
          columns: ['department_name'],
          description: "Mock: 제약조건 'departments_department_name_key' 설명."
        }
      ],
      indexes: [
        {
          name: 'departments_department_name_key',
          columns: ['department_name'],
          is_unique: true,
          description: null
        }
      ]
    },
    {
      id: 'TBL-ANNO-8DFD040F221A4F7C84A43CAB3F8C491A',
      created_at: '2025-08-19T09:26:55.081164',
      updated_at: '2025-08-19T09:26:55.081164',
      table_name: 'employees',
      description: "Mock: 'employees' 테이블에 대한 설명입니다.",
      columns: [
        {
          id: 'COL-ANNO-A06CCEF601C64761833B6866AB865037',
          column_name: 'employee_id',
          description: "Mock: 'employee_id' 컬럼에 대한 설명입니다.",
          data_type: 'int4',
          is_nullable: false,
          default_value: "nextval('employees_employee_id_seq'::regclass)"
        },
        {
          id: 'COL-ANNO-13DE388E01434CA4868ACEF32F3362EB',
          column_name: 'first_name',
          description: "Mock: 'first_name' 컬럼에 대한 설명입니다.",
          data_type: 'varchar',
          is_nullable: false,
          default_value: null
        },
        {
          id: 'COL-ANNO-BE6734D969594C258536735B32EA3339',
          column_name: 'last_name',
          description: "Mock: 'last_name' 컬럼에 대한 설명입니다.",
          data_type: 'varchar',
          is_nullable: false,
          default_value: null
        },
        {
          id: 'COL-ANNO-CB73B121B389413D9ED90B2FEBCC8168',
          column_name: 'email',
          description: "Mock: 'email' 컬럼에 대한 설명입니다.",
          data_type: 'varchar',
          is_nullable: false,
          default_value: null
        },
        {
          id: 'COL-ANNO-427CE85032B840B682487F3EE707939E',
          column_name: 'hire_date',
          description: "Mock: 'hire_date' 컬럼에 대한 설명입니다.",
          data_type: 'date',
          is_nullable: true,
          default_value: 'CURRENT_DATE'
        },
        {
          id: 'COL-ANNO-6BCCA2CCADFD49CFB4FC74E1E0E3E5D2',
          column_name: 'department_id',
          description: "Mock: 'department_id' 컬럼에 대한 설명입니다.",
          data_type: 'int4',
          is_nullable: true,
          default_value: null
        }
      ],
      constraints: [
        {
          name: 'employees_pkey',
          type: 'PRIMARY KEY',
          columns: ['employee_id'],
          description: "Mock: 제약조건 'employees_pkey' 설명."
        },
        {
          name: 'employees_email_key',
          type: 'UNIQUE',
          columns: ['email'],
          description: "Mock: 제약조건 'employees_email_key' 설명."
        }
      ],
      indexes: [
        {
          name: 'employees_email_key',
          columns: ['email'],
          is_unique: true,
          description: null
        }
      ]
    },
    {
      id: 'TBL-ANNO-9A436FEB63BF44088EAB30F7FFA0067F',
      created_at: '2025-08-19T09:26:55.081164',
      updated_at: '2025-08-19T09:26:55.081164',
      table_name: 'employee_projects',
      description: "Mock: 'employee_projects' 테이블에 대한 설명입니다.",
      columns: [
        {
          id: 'COL-ANNO-B5A1145E918A426BB51329C3C0751A8E',
          column_name: 'employee_id',
          description: "Mock: 'employee_id' 컬럼에 대한 설명입니다.",
          data_type: 'int4',
          is_nullable: false,
          default_value: null
        },
        {
          id: 'COL-ANNO-0C8536E5CCCE4A638B73B2401350B42A',
          column_name: 'project_id',
          description: "Mock: 'project_id' 컬럼에 대한 설명입니다.",
          data_type: 'int4',
          is_nullable: false,
          default_value: null
        }
      ],
      constraints: [
        {
          name: 'employee_projects_pkey',
          type: 'PRIMARY KEY',
          columns: ['project_id', 'employee_id'],
          description: "Mock: 제약조건 'employee_projects_pkey' 설명."
        }
      ],
      indexes: []
    },
    {
      id: 'TBL-ANNO-5BD2B4DE7952493CA8F14BF4C6509651',
      created_at: '2025-08-19T09:26:55.081164',
      updated_at: '2025-08-19T09:26:55.081164',
      table_name: 'projects',
      description: "Mock: 'projects' 테이블에 대한 설명입니다.",
      columns: [
        {
          id: 'COL-ANNO-A12E42F799024F218EE846147BF72147',
          column_name: 'project_id',
          description: "Mock: 'project_id' 컬럼에 대한 설명입니다.",
          data_type: 'int4',
          is_nullable: false,
          default_value: "nextval('projects_project_id_seq'::regclass)"
        },
        {
          id: 'COL-ANNO-2D43A840A84A4941A17BAC8F653432BA',
          column_name: 'project_name',
          description: "Mock: 'project_name' 컬럼에 대한 설명입니다.",
          data_type: 'varchar',
          is_nullable: false,
          default_value: null
        },
        {
          id: 'COL-ANNO-111DC6AD975B4CD4802C2B0D2C396FDC',
          column_name: 'start_date',
          description: "Mock: 'start_date' 컬럼에 대한 설명입니다.",
          data_type: 'date',
          is_nullable: true,
          default_value: null
        },
        {
          id: 'COL-ANNO-DB0C22BA62AC4780AD281E69A8222967',
          column_name: 'end_date',
          description: "Mock: 'end_date' 컬럼에 대한 설명입니다.",
          data_type: 'date',
          is_nullable: true,
          default_value: null
        }
      ],
      constraints: [
        {
          name: 'check_dates',
          type: 'CHECK',
          columns: [],
          description: "Mock: 제약조건 'check_dates' 설명."
        },
        {
          name: 'projects_pkey',
          type: 'PRIMARY KEY',
          columns: ['project_id'],
          description: "Mock: 제약조건 'projects_pkey' 설명."
        }
      ],
      indexes: []
    },
    {
      id: 'TBL-ANNO-921D771572A84E78B0D8D1FFEF7F8E87',
      created_at: '2025-08-19T09:26:55.081164',
      updated_at: '2025-08-19T09:26:55.081164',
      table_name: 'users',
      description: "Mock: 'users' 테이블에 대한 설명입니다.",
      columns: [
        {
          id: 'COL-ANNO-30907A95F1A64020964D8272421E50EE',
          column_name: 'id',
          description: "Mock: 'id' 컬럼에 대한 설명입니다.",
          data_type: 'int4',
          is_nullable: false,
          default_value: "nextval('my_app.users_id_seq'::regclass)"
        },
        {
          id: 'COL-ANNO-8159A0E058874BD39BDD037D73BC6DBD',
          column_name: 'username',
          description: "Mock: 'username' 컬럼에 대한 설명입니다.",
          data_type: 'varchar',
          is_nullable: false,
          default_value: null
        },
        {
          id: 'COL-ANNO-404DD23162DC4A6489EF1A8F041DF184',
          column_name: 'email',
          description: "Mock: 'email' 컬럼에 대한 설명입니다.",
          data_type: 'varchar',
          is_nullable: false,
          default_value: null
        },
        {
          id: 'COL-ANNO-0F04410B343C46A09FA554440BCC5B16',
          column_name: 'full_name',
          description: "Mock: 'full_name' 컬럼에 대한 설명입니다.",
          data_type: 'varchar',
          is_nullable: true,
          default_value: null
        },
        {
          id: 'COL-ANNO-CCD55E9B8FDC492484CCB16289EBA9F2',
          column_name: 'created_at',
          description: "Mock: 'created_at' 컬럼에 대한 설명입니다.",
          data_type: 'timestamptz',
          is_nullable: true,
          default_value: 'CURRENT_TIMESTAMP'
        },
        {
          id: 'COL-ANNO-BCB5ED8D1D244456B69B8D035E6267FD',
          column_name: 'is_active',
          description: "Mock: 'is_active' 컬럼에 대한 설명입니다.",
          data_type: 'bool',
          is_nullable: true,
          default_value: 'true'
        }
      ],
      constraints: [
        {
          name: 'users_pkey',
          type: 'PRIMARY KEY',
          columns: ['id'],
          description: "Mock: 제약조건 'users_pkey' 설명."
        },
        {
          name: 'users_username_key',
          type: 'UNIQUE',
          columns: ['username'],
          description: "Mock: 제약조건 'users_username_key' 설명."
        },
        {
          name: 'users_email_key',
          type: 'UNIQUE',
          columns: ['email'],
          description: "Mock: 제약조건 'users_email_key' 설명."
        }
      ],
      indexes: [
        {
          name: 'users_email_key',
          columns: ['email'],
          is_unique: true,
          description: null
        },
        {
          name: 'users_username_key',
          columns: ['username'],
          is_unique: true,
          description: null
        }
      ]
    }
  ]
}
