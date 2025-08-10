import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DATABASES, DatabaseInfo } from './wizard.type'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { DatabaseButton } from './database-button'

interface SelectDatabaseProp {
  selectedDatabase: DatabaseInfo | null
  setSelectedDatabase: (selectedDatabase: DatabaseInfo) => void
  connectionName: string
  setConnectionName: (name: string) => void
}

/**
 * DB 선택 페이지
 *
 * @author 6-keem
 * @param selectedDatabase 선택한 DB 변수 (상태)
 * @param setSelectedDatabase 선택한 DB 업데이트 함수
 * @param connectionName DB 연결 닉네임 변수 (상태)
 * @param setConnectionName DB 연결 닉네임 업데이터 함수
 * @returns JSX.Element
 */
export function SelectDatabase({
  selectedDatabase,
  setSelectedDatabase,
  connectionName,
  setConnectionName
}: SelectDatabaseProp): React.JSX.Element {
  // 검색어
  const [searchText, setSearchText] = useState<string>('')

  // 검색어 기반 DB 필터링
  const filteredDatabases = DATABASES.filter((db) =>
    db.label.toLowerCase().includes(searchText.toLowerCase())
  )

  return (
    <div className="self-stretch flex flex-col justify-start items-start gap-6">
      <div className="self-stretch flex flex-col justify-start items-start gap-2">
        <div className="self-stretch justify-start text-genie-100 text-sm font-bold font-['Pretendard'] leading-[21px]">
          데이터베이스 종류
        </div>
        <div className="relative w-full">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search className="size-4" />
          </div>
          <Input
            className="w-full pl-9 pr-8 text-xs text-white font-medium font-['Pretendard'] leading-[18px]
                      bg-genie-900 rounded-lg border border-genie-700 transition duration-150
                      focus:outline-none focus:ring-0 focus:ring-transparent focus:ring-offset-0 focus:border-primary-light"
            placeholder="예: MySQL, PostgreSQL"
            value={searchText}
            spellCheck={false}
            onChange={(e) => setSearchText(e.target.value)}
          />
          {searchText && (
            <Button
              className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
              onClick={() => setSearchText('')}
              aria-label="검색어 초기화"
            >
              <X className="size-4" />
            </Button>
          )}
        </div>
        <div
          className="
            w-full h-[290px] overflow-y-scroll
            self-stretch p-4 bg-gradient-genie-darkgray rounded-lg outline-1 
            outline-offset-[-1px] outline-genie-700 grid 
            grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8
            gap-0.5 place-items-start"
        >
          {/* DB 종류 랜더링 */}
          {filteredDatabases.map((databaseInfo) => (
            <div key={databaseInfo.key} className="w-full flex items-center justify-center">
              <DatabaseButton
                key={databaseInfo.key}
                databaseInfo={databaseInfo}
                isSelected={selectedDatabase?.key === databaseInfo.key}
                setSelectedDatabase={setSelectedDatabase}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="self-stretch flex flex-col justify-start items-start gap-2">
        <div className="self-stretch flex flex-col justify-start items-start gap-1">
          <div className="self-stretch justify-start text-genie-100 text-sm font-bold font-['Pretendard'] leading-[21px]">
            데이터베이스 연결 이름
          </div>
          <div className="self-stretch justify-start text-genie-500 text-xs font-medium font-['Pretendard'] leading-[18px]">
            이 연결을 나중에 쉽게 찾을 수 있도록 이름을 정할 수 있어요.
          </div>
        </div>

        <div className="relative w-full">
          <Input
            className="w-full pr-8 text-xs text-white font-medium font-['Pretendard'] leading-[18px]
                bg-gradient-genie-darkgray rounded-lg border border-genie-700 transition duration-150
                focus:outline-none focus:ring-0 focus:ring-transparent focus:ring-offset-0 focus:border-primary-light"
            placeholder="예: 인사 데이터, 고객 관리"
            value={connectionName}
            spellCheck={false}
            onChange={(e) => setConnectionName(e.target.value)}
          />
          {connectionName && (
            <Button
              className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
              onClick={() => setConnectionName('')}
              aria-label="연결 이름 초기화"
            >
              <X className="size-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
