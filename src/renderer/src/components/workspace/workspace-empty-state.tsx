import { Plus } from 'lucide-react'
import { FeatureCard } from './feature-card'
import type { FeatureCardData } from './types'
import naturalQueryImage from '../../assets/empty-image/natural-language-query.png'
import queryResultImage from '../../assets/empty-image/query-result.png'
import autoColumnImage from '../../assets/empty-image/auto-column-description.png'

const featureCards: FeatureCardData[] = [
  {
    title: '자연어 질의',
    description: (
      <>
        SQL을 몰라도 질문할 수 있어요.
        <br />
        자연어로 입력하면 쿼리를 만들어줘요.
      </>
    ),
    image: naturalQueryImage
  },
  {
    title: '쿼리 실행 결과 확인',
    description: (
      <>
        생성된 SQL을 직접 실행해볼 수 있어요.
        <br />
        결과는 표로 정리돼 한눈에 보여요.
      </>
    ),
    image: queryResultImage
  },
  {
    title: '자동 컬럼 설명 생성',
    description: (
      <>
        AI가 테이블과 컬럼을 분석해
        <br />
        이해하기 쉬운 설명을 자동으로 생성해줘요.
      </>
    ),
    image: autoColumnImage
  }
]

function handleConnectClick(): void {
  window.api.send('open-sub-window', {
    width: 800,
    height: 610,
    route: '/connection-wizard'
  })
}

export function WorkspaceEmptyState(): React.JSX.Element {
  return (
    <main className="flex-1 self-stretch bg-neutral-800 flex flex-col justify-center items-center gap-16 p-16">
      <div className="w-full flex flex-col justify-start items-center gap-4">
        <h1 className="self-stretch text-center text-neutral-200 text-xl font-bold font-['Pretendard']">
          데이터가 연결되지 않았어요
        </h1>
        <p className="text-center text-zinc-500 text-xs font-medium font-['Pretendard'] leading-normal">
          데이터베이스를 연결하고
          <br />
          질문하거나 쿼리를 작성해보세요.
        </p>
      </div>

      <div className="flex justify-center items-stretch gap-6 w-full max-w-5xl">
        {featureCards.map((card) => (
          <FeatureCard key={card.title} card={card} />
        ))}
      </div>

      <button
        onClick={handleConnectClick}
        className="pl-5 pr-7 py-3 bg-gradient-to-b from-violet-700 to-violet-800 rounded-2xl outline-2 outline-offset-[-2px] outline-white/20 inline-flex justify-center items-center gap-4 hover:from-violet-600 hover:to-violet-700 transition-colors hover:cursor-pointer"
      >
        <Plus className="size-4 stroke-neutral-200" />
        <span className="text-neutral-200 text-sm font-bold font-['Pretendard'] leading-tight">
          데이터베이스 연결하기
        </span>
      </button>
    </main>
  )
}
