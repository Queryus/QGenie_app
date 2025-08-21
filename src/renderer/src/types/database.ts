export interface ConnectionProfile {
  id: string
  type: 'mysql' | 'mariadb' | 'postgresql' | 'oracle' | 'sqlite'
  host: string | null
  port: number | null
  name: string | null
  username: string | null
  view_name: string | null
  created_at: string
  updated_at: string
}
