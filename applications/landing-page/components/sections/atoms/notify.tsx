import { useReducedMotion, motion } from 'framer-motion'
import { Check, ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState, useRef, useEffect, useCallback } from 'react'

import { UTM_KEYS } from '../UTM_KEYS'
import { type UtmParams } from '../UtmParams'

import { notifyMe } from '@/lib/actions/notify'
import { ease, fadeIn } from '@/lib/data/motion'

export function NotifyForm({ animated }: { animated: boolean }) {
  const t = useTranslations('comingSoon.form')
  const reduced = useReducedMotion()
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const formRef = useRef<HTMLFormElement>(null)
  const [utm, setUtm] = useState<UtmParams>({})

  // Capture UTM params + referrer once on mount (client-only)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const collected: UtmParams = {}
    for (let i = 0; i < UTM_KEYS.length; i++) {
      const key = UTM_KEYS[i]
      const val = params.get(key)
      if (val) collected[key] = val
    }
    if (document.referrer) collected.referrer = document.referrer.slice(0, 500)
    // Use requestAnimationFrame to avoid setState in render
    requestAnimationFrame(() => {
      setUtm(collected)
    })
  }, [])

  const handleSubmit = useCallback(
    async (formData: FormData) => {
      // Append UTM attribution to the server action payload
      for (const [key, val] of Object.entries(utm)) {
        formData.set(key, val)
      }
      setStatus('pending')
      const result = await notifyMe(formData)
      if (result.success) {
        setStatus('success')
        setMessage(result.message)
        formRef.current?.reset()
      } else {
        setStatus('error')
        setMessage(result.message)
      }
    },
    [utm]
  )

  if (status === 'success') {
    return (
      <motion.div
        data-atom
        className="flex items-center gap-2 font-body text-sm text-aq-blue"
        initial={animated ? { opacity: 0, y: 10 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
      >
        <Check className="h-4 w-4" />
        <span>{message}</span>
      </motion.div>
    )
  }

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <form ref={formRef} action={handleSubmit} className="flex w-full flex-col gap-3 sm:flex-row">
        <motion.div className="relative flex-1" {...fadeIn(reduced, 0.1)}>
          <input
            type="email"
            name="email"
            required
            placeholder={t('email.placeholder')}
            aria-label={t('email.aria')}
            disabled={status === 'pending'}
            className="h-12 w-full rounded-lg border border-border/30 bg-card/40 px-4 font-body text-sm text-foreground backdrop-blur-lg transition-colors placeholder:text-muted-foreground/60 focus:border-aq-blue/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-aq-blue disabled:opacity-50"
          />
        </motion.div>
        <motion.button
          data-atom
          type="submit"
          disabled={status === 'pending'}
          className="group z-30 inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-aq-blue px-6 font-ui text-sm font-medium text-foreground transition-colors hover:bg-aq-blue/90 focus-visible:ring-2 focus-visible:ring-aq-blue disabled:opacity-50"
          {...fadeIn(reduced, 0.15)}
        >
          {status === 'pending' ? (
            t('button.pending')
          ) : (
            <>
              {t('button.submit')}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </motion.button>
      </form>
      {status === 'error' && message && (
        <p className="font-body text-xs text-destructive">{message}</p>
      )}
      <motion.p
        className="text-center font-body text-[10px] text-muted-foreground/60 sm:text-left"
        {...fadeIn(reduced, 0.2)}
      >
        {t('terms')}
      </motion.p>
    </div>
  )
}
