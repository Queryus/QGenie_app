import { DATABASES } from '@/components/connection-wizard/wizard.type'
import { AnnotationItemProps } from './annotation.types'

export default function AnnotationItem({
  db,
  index,
  hasFocus,
  onToggle
}: AnnotationItemProps): React.JSX.Element {
  const handleToggle = (): void => {
    onToggle(index)
  }
  const dbItem = DATABASES.find((d) => d.id === db.type)

  const text = db.view_name ? db.view_name : db.type

  return (
    <div className="flex flex-col justify-start items-start w-full">
      <div
        data-state="Default"
        className={`w-full pl-2 pr-2 py-1 rounded inline-flex justify-start items-center gap-1 cursor-pointer ${hasFocus && 'bg-genie-600'} overflow-hidden`}
        onClick={handleToggle}
      >
        <div className="size-6 p-0 flex items-center justify-center shrink-0">
          <img src={dbItem?.icon} className="w-full h-full" />
        </div>
        <div className="flex gap-1 overflow-auto items-center truncate shrink-0">
          <div className="justify-start h-4 content-center text-neutral-200 text-xs font-semibold font-['Pretendard'] leading-none">
            {text}
          </div>
          <div className="justify-start h-4 content-center text-neutral-400 text-xs font-normal font-['Pretendard'] leading-none">
            {db.host}:{db.port}
          </div>
        </div>
      </div>
    </div>
  )
}
