'use client'

import { useState, useTransition } from 'react'
import { Download } from 'lucide-react'

import type { WaitlistStatus, WaitlistUser } from '@/types/database'
import { exportWaitlistCSV } from '@/lib/actions/waitlist'
import { Button } from '@/components/ui/button'
import { WaitlistStatusBadge } from '@/components/ui/status-badge'

import { UserSheet } from './user-sheet'

interface CRMClientProps {
  users: WaitlistUser[]
  statusFilter?: WaitlistStatus
  searchQuery?: string
}

export function CRMClient({ users, statusFilter, searchQuery }: CRMClientProps) {
  const [selected, setSelected] = useState<WaitlistUser | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [isExporting, startExport] = useTransition()

  function openUser(user: WaitlistUser) {
    setSelected(user)
    setSheetOpen(true)
  }

  function handleExport() {
    startExport(async () => {
      const csv = await exportWaitlistCSV({ status: statusFilter, search: searchQuery })
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `waitlist-${new Date().toISOString().slice(0, 10)}.csv`
      a.click()
      URL.revokeObjectURL(url)
    })
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          {users.length} user{users.length !== 1 ? 's' : ''}
        </p>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={handleExport}
          disabled={isExporting}
        >
          <Download className="h-4 w-4" />
          {isExporting ? 'Exporting…' : 'Export CSV'}
        </Button>
      </div>

      <div className="border-border overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-border bg-muted/50 border-b">
              <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium">
                Name
              </th>
              <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium">
                Company
              </th>
              <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium">
                Email
              </th>
              <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium">
                Source
              </th>
              <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium">
                Status
              </th>
              <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium">
                Score
              </th>
              <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium">
                Signed Up
              </th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-muted-foreground px-4 py-8 text-center">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="border-border hover:bg-muted/30 cursor-pointer border-b transition-colors last:border-0"
                  onClick={() => openUser(user)}
                >
                  <td className="px-4 py-3 font-medium">{user.full_name ?? '—'}</td>
                  <td className="text-muted-foreground px-4 py-3">{user.company ?? '—'}</td>
                  <td className="text-muted-foreground px-4 py-3 font-mono text-xs">
                    {user.email}
                  </td>
                  <td className="text-muted-foreground px-4 py-3 capitalize">
                    {user.source.replace(/-/g, ' ')}
                  </td>
                  <td className="px-4 py-3">
                    <WaitlistStatusBadge status={user.status} />
                  </td>
                  <td className="text-muted-foreground px-4 py-3 tabular-nums">
                    {user.lead_score}
                  </td>
                  <td className="text-muted-foreground px-4 py-3 text-xs tabular-nums">
                    {new Date(user.created_at).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <UserSheet user={selected} open={sheetOpen} onOpenChange={setSheetOpen} />
    </>
  )
}
