export async function readApiError(response: Response, fallback: string) {
  const body = await response.json().catch(() => null)
  if (body && typeof body === 'object' && 'error' in body && typeof body.error === 'string') {
    return body.error
  }

  return `${fallback} (${response.status})`
}
