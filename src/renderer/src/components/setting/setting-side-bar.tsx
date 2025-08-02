import { CircleQuestionMarkIcon, Code2, KeyRound } from 'lucide-react'
import { SettingSection, SettingItem } from './settings.types'

const SETTING_ITEMS: SettingItem[] = [
  {
    icon: <KeyRound className="size-3 relative overflow-hidden" />,
    label: 'API 키 관리',
    key: SettingSection.KeyManagement
  },
  {
    icon: <Code2 className="size-3 relative overflow-hidden" />,
    label: '코드 에디터 설정',
    key: SettingSection.StylingCodeEditor
  },
  {
    icon: <CircleQuestionMarkIcon className="size-3 relative overflow-hidden" />,
    label: '도움말',
    key: SettingSection.Info
  }
]

interface SettingSideBarProp {
  activeTab: SettingSection
  setActiveTab: (activeTab: SettingSection) => void
}

/**
 * 설정 모달의 사이드바
 *
 * @author 6-keem
 *
 * @param activeTab 현재 활성화 탭 (상태)
 * @param setActiveTab 활성화 탭 변경 함수
 * @returns JSX.Element
 */
export default function SettingSideBar({
  activeTab,
  setActiveTab
}: SettingSideBarProp): React.JSX.Element {
  return (
    <div className="flex-[1] w-full bg-genie-900 self-stretch px-4 py-6 inline-flex flex-col justify-start items-start gap-2">
      {SETTING_ITEMS.map((settingItem) => {
        return (
          <div
            key={settingItem.key}
            className={`w-full text-genie-500  px-4 py-2 rounded-sm inline-flex justify-start items-center gap-4 transition duration-200 cursor-pointer hover:bg-genie-800 ${activeTab === settingItem.key && 'bg-genie-800'}`}
            onClick={() => setActiveTab(settingItem.key)}
          >
            {settingItem.icon}
            <div className="justify-start text-genie-100 text-xs font-medium font-['Pretendard'] leading-[18px]">
              {settingItem.label}
            </div>
          </div>
        )
      })}
    </div>
  )
}
