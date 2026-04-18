export interface EventStatInput {
  is_active: boolean
  start_at: string | null
  end_at: string | null
}

export interface EventStats {
  total: number
  active: number
  upcoming: number
  past: number
}

export function computeEventStats(events: EventStatInput[]): EventStats {
  const now = new Date()

  return {
    total: events.length,
    active: events.filter((event) => event.is_active).length,
    upcoming: events.filter((event) => event.start_at && new Date(event.start_at) > now).length,
    past: events.filter((event) => event.end_at && new Date(event.end_at) < now).length,
  }
}
