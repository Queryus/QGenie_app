/**
 * 모든 API 응답을 위한 제네릭 인터페이스
 * @template T API 응답의 `data` 필드 타입
 */
export interface ApiResponse<T> {
  code: string
  message: string
  data: T
}
