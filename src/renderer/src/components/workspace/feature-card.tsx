import type { FeatureCardData } from './types'

interface FeatureCardProps {
  card: FeatureCardData
}

export function FeatureCard({ card }: FeatureCardProps): React.JSX.Element {
  return (
    <div className="flex-1 bg-gradient-to-b from-stone-900 to-neutral-800 rounded-[20px] outline-1 outline-offset-[-1px] outline-neutral-700 flex flex-col justify-start items-center overflow-hidden">
      <img src={card.image} alt={card.title} className="w-full h-48 object-cover" />
      <div className="self-stretch p-5 flex flex-col justify-center items-center gap-4">
        <div className="self-stretch text-center text-violet-400 text-xs font-medium font-['Pretendard'] leading-none">
          {card.title}
        </div>
        <div className="self-stretch text-center text-neutral-200 text-sm font-bold font-['Pretendard'] leading-tight">
          {card.description}
        </div>
      </div>
    </div>
  )
}
