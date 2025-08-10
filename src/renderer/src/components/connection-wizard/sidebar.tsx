import { DB_SETUP_STEPS, DBSetupStep } from './wizard.type'

interface SidebarProp {
  activeTab: DBSetupStep
}

/**
 * TODO: activeTab을 기준으로 이전 단계, 현재 단계 이후 단계 다르게 스타일링
 *
 * @param activeTab 현재 활성화된 탭
 * @returns 사이드바
 */
const Sidebar = ({ activeTab }: SidebarProp): React.JSX.Element => {
  const activeIndex = DB_SETUP_STEPS.findIndex((step) => step.key === activeTab)
  return (
    <div className="w-full self-stretch p-6 inline-flex flex-col justify-start items-start gap-2">
      {DB_SETUP_STEPS.map((step, index) => {
        let status: 'done' | 'active' | 'upcoming' = 'upcoming'
        if (index < activeIndex) status = 'done'
        else if (index === activeIndex) status = 'active'

        const baseClass = 'w-full p-2 rounded-lg inline-flex justify-start items-center gap-[13px]'

        const statusClass = {
          done: 'bg-genie-800 text-genie-500',
          active: 'bg-genie-800 text-genie-100',
          upcoming: 'bg-transparent text-genie-500'
        }[status]

        const numberBg = {
          done: 'bg-gradient-genie-gray outline-white/20',
          active: 'bg-gradient-genie-gray outline-white/20',
          upcoming: 'bg-gradient-genie-darkgray outline-genie-700'
        }[status]

        return (
          <div key={step.key} data-status={status} className={`${baseClass} ${statusClass}`}>
            <div
              className={`w-[33px] h-[33px] p-2 bg-gradient-to-b rounded-lg 
                outline-1 outline-offset-[-1px] flex flex-col justify-center items-center ${numberBg}
                transition-all duration-300 ease-in-out
            `}
            >
              <span className={`text-xs font-bold font-['Pretendard'] leading-[18px]`}>
                {`0${index + 1}`}
              </span>
            </div>
            <span className="text-xs font-medium leading-[18px] font-['Pretendard']">
              {step.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default Sidebar
