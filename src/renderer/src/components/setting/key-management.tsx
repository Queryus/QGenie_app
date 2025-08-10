import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

/**
 * API 설정 화면
 *
 * @author 6-keem
 *
 * @returns JSX.Element
 */
export default function KeyManagement(): React.JSX.Element {
  const [apiKey, setApiKey] = useState('')

  return (
    <div className="self-stretch flex flex-col justify-start items-start gap-6">
      <div className="flex flex-col gap-1 w-full">
        <label className="text-sm text-white font-semibold pb-1.5">OpenAI API Key</label>
        <div className="relative w-full">
          <Input
            type="password"
            placeholder="API Key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            spellCheck={false}
            className={`w-full pr-8 text-xs text-white font-medium font-['Pretendard'] leading-[18px]
              bg-gradient-genie-darkgray rounded-lg border border-genie-700 transition duration-150
              focus:outline-none focus:ring-0 focus:ring-transparent focus:ring-offset-0 focus:border-primary-light`}
          />
          {apiKey && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setApiKey('')}
              className="absolute right-1 top-1/2 -translate-y-1/2"
            >
              <X className="w-4 h-4 text-white/50 hover:text-white" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
