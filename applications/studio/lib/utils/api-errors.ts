export async function readApiError(response: Response, fallback: string) {
  const body = await response.json().catch(() => null)

  if (body && typeof body === 'object') {
    // Priority 1: Specific error message
    if ('error' in body && typeof body.error === 'string') {
      const parts = [body.error]
      // Priority 2: Diagnostic details (technical but useful)
      if ('diagnostic' in body && typeof body.diagnostic === 'string') {
        parts.push(`(${body.diagnostic})`)
      }
      return parts.join(' ')
    }
  }

  return `${fallback} (${response.status})`
}
