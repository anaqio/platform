'use client'

import { useToggle } from '@uidotdev/usehooks'
import { useTranslations } from 'next-intl'
import { type ReactNode, useMemo } from 'react'

import { AtelierInvitationForm } from '@/components/sections/atelier-invitation'
import { Button } from '@anaqio/ui'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { DataManager } from '@/lib/utils/data-manager'

interface AtelierCardContent {
  eyebrow: string
  title: string
  footnote: string
}

interface AtelierFormProps {
  trigger?: ReactNode
}

export function AtelierForm({ trigger }: AtelierFormProps) {
  const t = useTranslations('atelierInvitation')
  const [open, toggleOpen] = useToggle(false)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const card = useMemo(() => DataManager<AtelierCardContent>(t, 'card'), [])

  const defaultTrigger = (
    <Button variant="default" size="lg" className="bg-aq-blue text-white hover:bg-aq-blue/90">
      {t('ui.requestInvitation')}
    </Button>
  )

  return (
    <Drawer open={open} onOpenChange={toggleOpen}>
      <DrawerTrigger asChild>{trigger ?? defaultTrigger}</DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-xl px-6 pb-10">
          <DrawerHeader className="px-0 pb-6 pt-8">
            <DrawerTitle className="font-display text-2xl font-light">{card.title}</DrawerTitle>
            <DrawerDescription className="font-body text-sm text-muted-foreground">
              {card.footnote}
            </DrawerDescription>
          </DrawerHeader>

          <AtelierInvitationForm />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
