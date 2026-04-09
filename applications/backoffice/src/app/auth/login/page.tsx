'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      router.push('/dashboard')
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Invalid credentials')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1B2F52]">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="font-syne text-2xl font-bold text-[#1B2F52]">ANAQIO</h1>
          <p className="mt-2 text-sm text-gray-500">Backoffice Login</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-xs font-medium uppercase tracking-widest text-gray-500"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-gray-200 bg-gray-50/50 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-[#2C5F8A] focus:outline-none focus:ring-1 focus:ring-[#2C5F8A]"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-xs font-medium uppercase tracking-widest text-gray-500"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-gray-200 bg-gray-50/50 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-[#2C5F8A] focus:outline-none focus:ring-1 focus:ring-[#2C5F8A]"
              />
            </div>

            {error && <p className="text-xs font-medium text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 h-11 w-full rounded-md bg-[#1B2F52] font-semibold text-white transition-colors hover:bg-[#2C5F8A] disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
