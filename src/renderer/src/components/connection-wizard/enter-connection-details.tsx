import { X } from 'lucide-react'
import { ConnectionDetail } from './wizard.type'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { cn } from '@/lib/utils'

interface EnterConnectionDetailsProp {
  connectionDetail: ConnectionDetail
  setConnectionDetail: React.Dispatch<React.SetStateAction<ConnectionDetail>>
  errorFields?: { [key: string]: boolean }
  setErrorFields?: (fields: { [key: string]: boolean }) => void
}

interface InputFieldProps {
  label: string
  field: keyof ConnectionDetail
  placeholder?: string
  connectionDetail: ConnectionDetail
  setConnectionDetail: (detail: ConnectionDetail) => void
  isNumber?: boolean
  hasError?: boolean
  onClearError?: () => void
}

function InputField({
  label,
  field,
  placeholder,
  connectionDetail,
  setConnectionDetail,
  isNumber = false,
  hasError,
  onClearError
}: InputFieldProps): React.JSX.Element {
  const value = connectionDetail[field] ?? ''
  const showClear = value !== ''

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const val = isNumber ? Number(e.target.value) : e.target.value
    setConnectionDetail({ ...connectionDetail, [field]: val })

    if (hasError && onClearError) {
      onClearError()
    }
  }

  const handleClear = (): void => {
    setConnectionDetail({ ...connectionDetail, [field]: '' })
    onClearError?.()
  }

  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-sm text-white font-semibold pb-1.5">{label}</label>
      <div className="relative">
        <Input
          type={isNumber ? 'number' : field === 'password' ? 'password' : 'text'}
          value={value}
          onChange={handleChange}
          placeholder={placeholder || label}
          spellCheck={false}
          className={cn(
            `w-full pr-8 text-xs text-white font-medium font-['Pretendard'] leading-[18px]
     bg-gradient-genie-darkgray rounded-lg border border-genie-700 transition duration-150
     focus:outline-none focus:ring-0 focus:ring-transparent focus:ring-offset-0 focus:border-primary-light`,
            hasError && 'border-error'
          )}
        />
        {showClear && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2"
            onClick={handleClear}
          >
            <X className="w-4 h-4 text-white/50 hover:text-white" />
          </Button>
        )}
      </div>
    </div>
  )
}

/**
 * DB 연결 정보를 입력하는 페이지
 * - `host`, `port`, `databaseName` 입력 필수
 *
 * @author 6-keem
 *
 * @param connectionDetail DB 연결 정보 변수 (상태)
 * @param setConnectionDetail DB 연결 정보 업데이트 함수
 * @param errorFields 에러가 발생한 필드 (상태)
 * @param setErrorFields 에러 상태 업데이트 함수
 * @returns JSX.Element
 */
export default function EnterConnectionDetails({
  connectionDetail,
  setConnectionDetail,
  errorFields = {},
  setErrorFields
}: EnterConnectionDetailsProp): React.JSX.Element {
  return (
    <div className="grid grid-cols-2 gap-x-2 gap-y-6 w-full">
      <InputField
        label="호스트"
        field="host"
        placeholder="localhost"
        connectionDetail={connectionDetail}
        setConnectionDetail={setConnectionDetail}
        hasError={errorFields.host}
        onClearError={() => setErrorFields?.({ ...errorFields, host: false })}
      />
      <InputField
        label="포트"
        field="port"
        placeholder="3306"
        isNumber
        connectionDetail={connectionDetail}
        setConnectionDetail={setConnectionDetail}
        hasError={errorFields.port}
        onClearError={() => setErrorFields?.({ ...errorFields, port: false })}
      />
      <InputField
        label="사용자명"
        field="username"
        placeholder="username"
        connectionDetail={connectionDetail}
        setConnectionDetail={setConnectionDetail}
        hasError={errorFields.username}
        onClearError={() => setErrorFields?.({ ...errorFields, username: false })}
      />
      <InputField
        label="비밀번호"
        field="password"
        connectionDetail={connectionDetail}
        setConnectionDetail={setConnectionDetail}
        hasError={errorFields.password}
        onClearError={() => setErrorFields?.({ ...errorFields, password: false })}
      />

      <div className="col-span-2">
        <InputField
          label="데이터베이스명"
          field="databaseName"
          placeholder="ex. my-database"
          connectionDetail={connectionDetail}
          setConnectionDetail={setConnectionDetail}
          hasError={errorFields.databaseName}
          onClearError={() => setErrorFields?.({ ...errorFields, databaseName: false })}
        />
      </div>
    </div>
  )
}
