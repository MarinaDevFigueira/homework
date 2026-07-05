export interface ApiResponse<T> {
  data: T
  error: null
}

export interface ApiError {
  data: null
  error: string
}

export type ApiResult<T> = ApiResponse<T> | ApiError

export interface PaginatedResponse<T> {
  data: T[]
  error: null
  meta: {
    total: number
    page: number
    limit: number
  }
}
