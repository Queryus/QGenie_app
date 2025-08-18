export enum DBSetupStep {
  SelectDatabase = 'selectDatabase',
  InstallDriver = 'installDriver',
  EnterConnectionDetails = 'enterConnectionDetails',
  TestConnection = 'testConnection',
  ConfirmSettings = 'confirmSettings'
}

export interface StepInfo {
  key: DBSetupStep
  label: string
}

export const DB_SETUP_STEPS: StepInfo[] = [
  { key: DBSetupStep.SelectDatabase, label: '데이터베이스 종류' },
  { key: DBSetupStep.InstallDriver, label: '드라이버 설치' },
  { key: DBSetupStep.EnterConnectionDetails, label: '연결 정보 입력' },
  { key: DBSetupStep.TestConnection, label: '연결 테스트' },
  { key: DBSetupStep.ConfirmSettings, label: '최종 확인' }
]

export enum Database {
  MySQL = 'MySQL',
  MariaDB = 'MariaDB',
  PostgreSQL = 'PostgreSQL',
  SQLite = 'SQLite',
  MicrosoftSQLServer = 'MicrosoftSQLServer',
  Oracle = 'Oracle'
}

export interface DatabaseInfo {
  key: Database
  label: string
  icon: string
  id: string
}

export const DATABASES: DatabaseInfo[] = [
  { key: Database.MySQL, label: 'MySQL', icon: '/mysql.png', id: 'mysql' },
  { key: Database.MariaDB, label: 'MariaDB', icon: '/mariadb.png', id: 'mariadb' },
  { key: Database.PostgreSQL, label: 'PostgreSQL', icon: '/postgresql.png', id: 'postgresql' },
  { key: Database.SQLite, label: 'SQLite', icon: '/sqlite.png', id: 'sqlite' },
  {
    key: Database.MicrosoftSQLServer,
    label: 'Microsoft SQL Server',
    icon: '/microsoft.png',
    id: 'sqlserver'
  },
  { key: Database.Oracle, label: 'Oracle', icon: '/oracle.png', id: 'oracle' }
]

export interface ConnectionDetail {
  nickname: string | null
  databaseName: string | null
  username: string | null
  password: string | null
  host: string | null
  port: number | null
  databaseType: Database | null
}
