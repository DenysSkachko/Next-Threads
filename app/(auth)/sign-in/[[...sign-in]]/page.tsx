'use client'

import { useState } from 'react'
import { useSignIn } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'

export default function Page() {
  const { signIn } = useSignIn()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (!signIn) throw new Error('SignIn not ready')

      const result = await signIn.create({ identifier: email, password })

      if (result.status === 'complete') {
        router.push('/')
      } else if (result.status === 'needs_first_factor') {
        setError('Additional verification required')
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.longMessage || err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthSignIn = async (provider: 'google' | 'github') => {
    if (!signIn) return
    try {
      await signIn.authenticateWithRedirect({
        strategy: provider === 'google' ? 'oauth_google' : 'oauth_github',
        redirectUrl: '/', 
        redirectUrlComplete: '/', 
      })
    } catch (err: any) {
      setError(err.errors?.[0]?.longMessage || err.message || 'Something went wrong')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-4 px-4">
      <div className="w-full max-w-md p-6 bg-dark-2 rounded-2xl shadow-xl">
        <h1 className="text-2xl font-bold text-light-1 mb-2 text-center">
          Sign in Proxima Threads
        </h1>
        <p className="text-gray-400 mb-6 text-center">Welcome back! Please sign in to continue</p>

        <form onSubmit={handleSignIn} className="flex flex-col gap-4">
          <div>
            <label className="text-light-1 mb-1 block">Email address or username</label>
            <input
              type="text"
              placeholder="Email"
              value={email}
              autoComplete='off'
              onChange={e => setEmail(e.target.value)}
              className="bg-dark-3 text-light-1 border border-gray-700 rounded-md p-2 w-full placeholder-gray-500"
              required
            />
          </div>

          <div>
            <label className="text-light-1 mb-1 block">Password</label>
            <input
              type="password"
              placeholder="•••••••••"
              value={password}
              autoComplete='off'
              onChange={e => setPassword(e.target.value)}
              className="bg-dark-3 text-light-1 border border-gray-700 rounded-md p-2 w-full placeholder-gray-500"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-primary-500 hover:bg-primary-600 text-white py-2 rounded-md w-full transition-all disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="flex flex-col gap-2 mt-4">
          <button
            type="button"
            onClick={() => handleOAuthSignIn('google')}
            className="bg-dark-3 text-light-1 border border-gray-700 py-2 rounded-md flex items-center justify-center gap-2 hover:bg-dark-1 transition-all"
          >
            <FcGoogle size={18} />
            Sign in with Google
          </button>
          <button
            type="button"
            onClick={() => handleOAuthSignIn('github')}
            className="bg-dark-3 text-light-1 border border-gray-700 py-2 rounded-md flex items-center justify-center gap-2 hover:bg-dark-1 transition-all"
          >
            <FaGithub size={18} />
            Sign in with GitHub
          </button>
        </div>

        <p className="mt-4 text-gray-400 text-center">
          Don’t have an account?{' '}
          <a href="/sign-up" className="text-primary-500 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  )
}
