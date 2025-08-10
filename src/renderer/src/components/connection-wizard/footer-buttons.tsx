import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '../ui/button'
import { DB_SETUP_STEPS, DBSetupStep } from './wizard.type'

interface FooterButtonsProp {
  activeTab: DBSetupStep
  setActiveTab: (acitveTab: DBSetupStep) => void
  onClose: () => void
  onSave: () => void
}

/**
 * 각 탭 하단에 랜더링되는 버튼
 *
 * - 첫 페이지에서 취소 버튼을 누르면 `onClose` 콜백
 * - 마지막 페이지에서 완료 버튼을 누르면 `onSave` 콜백
 *
 * @author 6-keem
 *
 * @param activeTab 현재 보여지는 탭 (상태)
 * @param setActiveTab activeTab 업데이트 함수
 * @param onClose 첫 페이지에서 모달 닫는 콜백 함수
 * @param onSave 마지막 페이지에서 연걸 저장 콜백 함수
 * @returns JSX.Element
 */
export const FooterButtons = ({
  activeTab,
  setActiveTab,
  onClose,
  onSave
}: FooterButtonsProp): React.JSX.Element => {
  // 이동할 수 있는 판단
  const getPageIndex = (current: DBSetupStep, offset: number): DBSetupStep | null => {
    const index = DB_SETUP_STEPS.findIndex((step) => step.key === current)
    const next = DB_SETUP_STEPS[index + offset]
    return next?.key ?? null
  }

  const onButtonClick = (nextMove: DBSetupStep | null): void => {
    if (!nextMove) throw Error('오류')
    setActiveTab(nextMove)
  }

  const isFirstStep = activeTab === DBSetupStep.SelectDatabase
  const leftText = isFirstStep ? '취소' : '이전'
  const leftHandler = isFirstStep ? onClose : () => onButtonClick(getPageIndex(activeTab, -1))

  const isLastStep = activeTab === DBSetupStep.ConfirmSettings
  const rightText = isLastStep ? '완료' : '다음'
  const rightHandler = isLastStep ? onSave : () => onButtonClick(getPageIndex(activeTab, 1))

  return (
    <div className="self-stretch inline-flex justify-end items-center gap-2">
      <div className="bg-gradient-genie-gray rounded-lg outline-1 outline-offset-[-1px] outline-white/20 flex justify-center items-center gap-2">
        <Button
          onClick={leftHandler}
          variant={'secondary'}
          className="justify-start text-genie-100 text-xs font-semibold font-['Pretendard'] cursor-pointer"
        >
          <ChevronLeft className="size-3 relative overflow-hidden text-white" />
          {leftText}
        </Button>
      </div>

      <div className="bg-gradient-genie-primary rounded-lg outline-1 outline-offset-[-1px] outline-white/20 flex justify-center items-center gap-2">
        <Button
          onClick={rightHandler}
          variant={'secondary'}
          className="justify-start text-genie-100 text-xs font-semibold font-['Pretendard'] cursor-pointer"
        >
          {rightText}
          <ChevronRight className="size-3 relative overflow-hidden text-white" />
        </Button>
      </div>
    </div>
  )
}
