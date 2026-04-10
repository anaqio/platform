export function createDbError(table: string, operation: string) {
  return (error: { message: string }) => new Error(`[${table}.${operation}] ${error.message}`)
}

export function createApiError(endpoint: string) {
  return (error: string) => new Error(`[api.${endpoint}] ${error}`)
}
