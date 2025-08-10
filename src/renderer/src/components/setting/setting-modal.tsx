import { useState } from 'react'
import KeyManagement from './key-management'
import SettingSideBar from './setting-side-bar'
import { SettingSection } from './settings.types'

/**
 * 설정 모달 화면
 *
 * @author 6-keem
 *
 * @returns JSX.Element
 */
export default function SettingModal(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState(SettingSection.KeyManagement)
  return (
    <div className={`flex w-full h-screen min-w-[800px] items-center justify-center`}>
      <SettingSideBar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="p-6 w-full h-full flex-[2] bg-genie-800">
        <KeyManagement />
      </div>
    </div>
  )
}
