import { cn } from '@/lib/utils'

/**
 * @author hyynjju
 * @summary AI 응답 대기 중 표시되는 타이핑 애니메이션
 * @param className 추가 CSS 클래스
 * @returns JSX.Element
 */
export default function TypingLoadingAnimation({
  className
}: {
  className?: string
}): React.JSX.Element {
  return (
    <div className={cn('flex items-end h-12', className)}>
      <div className={cn('flex items-center gap-1.5')}>
        <div
          className={cn('rounded-full bg-neutral-400 w-2 h-2')}
          style={{
            animation: 'typingBounce 1.8s infinite ease-in-out',
            animationDelay: '0s'
          }}
        />
        <div
          className={cn('rounded-full bg-neutral-400 w-2 h-2')}
          style={{
            animation: 'typingBounce 1.8s infinite ease-in-out',
            animationDelay: '0.2s'
          }}
        />
        <div
          className={cn('rounded-full bg-neutral-400 w-2 h-2')}
          style={{
            animation: 'typingBounce 1.8s infinite ease-in-out',
            animationDelay: '0.4s'
          }}
        />
      </div>

      {/* 키프레임 애니메이션 */}
      <style>{`
        @keyframes typingBounce {
          0%, 70%, 100% {
            transform: translateY(0) scale(0.9);
            opacity: 0.3;
          }
          25% {
            transform: translateY(-8px) scale(1.1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
