import { DatabaseInfo } from './wizard.type'

interface DatabaseButtonProps {
  databaseInfo: DatabaseInfo
  isSelected: boolean
  setSelectedDatabase: (selectedDatabase: DatabaseInfo) => void
}

/**
 * 정의된 DB 랜더링
 *
 * @author 6-keem
 *
 * @param databaseInfo 사용가능한 DB 종류
 * @param isSelected 자신의 `databaseInfo`가 선택 되었는 지
 * @param setSelectedDatabase selectedDatabase 상태 업데이트 함수
 * @returns JSX.Element
 */
export const DatabaseButton = ({
  databaseInfo,
  isSelected,
  setSelectedDatabase
}: DatabaseButtonProps): React.JSX.Element => {
  return (
    <div
      data-isselect="False"
      className={`w-[100px] h-[124px] rounded-lg inline-flex flex-col justify-center items-center select-none cursor-pointer 
        ${isSelected && 'bg-gradient-to-b bg-gradient-genie-gray transition duration-200'}`}
      onClick={() => setSelectedDatabase(databaseInfo)}
    >
      <div className="w-[100px] h-20 flex overflow-hidden justify-center items-center">
        <img className="select-none" draggable={false} src={databaseInfo.icon} />
      </div>
      <div className="flex h-[36px] items-center text-center justify-center text-genie-100 text-xs font-medium font-['Pretendard'] leading-[18px]">
        {databaseInfo.label}
      </div>
    </div>
  )
}
