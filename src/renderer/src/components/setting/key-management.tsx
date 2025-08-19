import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { api } from '@renderer/utils/api'
import { toast } from 'sonner'

interface APIKey {
  service_name: string
  id: string
  created_at?: string
  updated_at?: string
}

/**
 * API 설정 화면
 *
 * @author 6-keem
 *
 * @returns JSX.Element
 */
export default function KeyManagement(): React.JSX.Element {
  const didFetch = useRef(false)
  const [isEditable, setIsEditable] = useState(false)
  const [apiKey, setApiKey] = useState<APIKey>({ service_name: 'openai', id: '' })

  useEffect(() => {
    if (didFetch.current) return
    didFetch.current = true

    api
      .get('/api/keys/find')
      .then((response) => {
        const data = response.data
        setApiKey(data[0])
      })
      .catch(() => {
        toast.error('API 키 불러오기 중 오류가 발생했습니다.')
      })
  })

  const saveAPIKey = async (): Promise<void> => {
    if (!apiKey.id.startsWith('sk-')) {
      toast.error('유효하지 않은 API 키입니다. "sk-"로 시작해야 합니다.')
      return
    }
    // update
    if (apiKey.created_at) {
      api
        .put(`/api/keys/modify/${apiKey.service_name}`, {
          api_key: apiKey.id
        })
        .then(() => {
          toast.success('API 키 저장이 완료되었습니다.')
        })
        .catch(() => {
          toast.error('API 키 저장하기 중 오류가 발생했습니다.')
        })
    }
    // create
    else {
      api
        .post('/api/keys/create', {
          service_name: 'OpenAI',
          api_key: apiKey.id
        })
        .then(() => {
          toast.success('API 키 저장이 완료되었습니다.')
        })
        .catch(() => {
          toast.error('API 키 저장하기 중 오류가 발생했습니다.')
        })
    }
  }

  return (
    <div className="self-stretch flex flex-col justify-start items-start gap-6 h-full">
      <div className="flex flex-col gap-1 w-full h-full">
        <label className="text-sm text-white font-semibold pb-1.5">OpenAI API Key</label>
        <div className="relative w-full">
          <Input
            type="password"
            placeholder="API Key"
            value={apiKey.id}
            readOnly={!isEditable}
            onChange={(e) => setApiKey((prev) => ({ ...prev, id: e.target.value }))}
            spellCheck={false}
            className={`w-full pr-8 text-xs text-white font-medium font-['Pretendard'] leading-[18px]
              bg-gradient-to-b from-[#1d1d1d] to-neutral-800 rounded-lg border border-[#383838] transition duration-150 ring-0 ring-transparent
              ${isEditable && 'focus:outline-none focus:ring-0 focus:ring-transparent focus:ring-offset-0 focus:border-[#9F73FF]'}`}
          />
          {!isEditable && apiKey.id && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setApiKey((prev) => ({ ...prev, id: '' }))
                setIsEditable(true)
              }}
              className="absolute right-1 top-1/2 -translate-y-1/2"
            >
              <X className="w-4 h-4 text-white/50 hover:text-white" />
            </Button>
          )}
        </div>
      </div>
      <div className="flex w-full justify-end">
        <div className="bg-gradient-genie-primary rounded-lg outline-1 outline-offset-[-1px] outline-white/20 flex justify-center items-center gap-2">
          <Button
            onClick={saveAPIKey}
            variant={'secondary'}
            disabled={!isEditable}
            className="justify-start text-genie-100 text-xs font-semibold font-['Pretendard'] cursor-pointer"
          >
            저장
          </Button>
        </div>
      </div>
    </div>
  )
}
