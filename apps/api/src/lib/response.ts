export function ok<T>(data: T) {
  const response = { data, error: null }
  return response
}

export function created<T>(data: T) {
  const response = { data, error: null }
  return response
}

export function notFound(message: string) {
  const response = { data: null, error: message }
  return response
}

export function forbidden(message: string) {
  const response = { data: null, error: message }
  return response
}

export function unauthorized(message: string) {
  const response = { data: null, error: message }
  return response
}

export function badRequest(message: string) {
  const response = { data: null, error: message }
  return response
}
