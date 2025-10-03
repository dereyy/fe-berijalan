export interface APIBaseResponse<T = unknown, E = unknown> {
  status: boolean
  message: string
  data?: T
  error?: E
  pagination?: IPagination
}

export interface IPagination {
  totalRecords: number
  currentPage: number
  totalPage: number
  nextPage: number
  prevPage: number
  limit: number
}

export interface IValidationError {
  field: string
  message: string
  type: string
}
