'use client'

import { useState } from 'react'
import { useSignUp } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'

export default function Page() {
  const { signUp } = useSignUp()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (!signUp) throw new Error('SignUp not ready')

      const result = await signUp.create({
        emailAddress: email,
        password,
        username,
      })

      if (result.status === 'complete') {
        router.push('/')
      } else {
        setError('Please complete the sign-up process.')
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.longMessage || err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthSignUp = async (provider: 'google' | 'github') => {
    if (!signUp) return
    try {
      await signUp.authenticateWithRedirect({
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
          Create your account
        </h1>
        <p className="text-gray-400 mb-6 text-center">Join Proxima Threads today</p>

        <form onSubmit={handleSignUp} className="flex flex-col gap-4">
          <div>
            <label className="text-light-1 mb-1 block">Username</label>
            <input
              type="text"
              placeholder="username"
              value={username}
              autoComplete="off"
              onChange={e => setUsername(e.target.value)}
              className="bg-dark-3 text-light-1 border border-gray-700 rounded-md p-2 w-full placeholder-gray-500"
              required
            />
          </div>

          <div>
            <label className="text-light-1 mb-1 block">Email address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              autoComplete="email"
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
              autoComplete="new-password"
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
            {loading ? 'Signing up...' : 'Sign up'}
          </button>
        </form>

        <div className="flex flex-col gap-2 mt-4">
          <button
            type="button"
            onClick={() => handleOAuthSignUp('google')}
            className="bg-dark-3 text-light-1 border border-gray-700 py-2 rounded-md flex items-center justify-center gap-2 hover:bg-dark-1 transition-all"
          >
            <FcGoogle size={18} />
            Sign up with Google
          </button>
          <button
            type="button"
            onClick={() => handleOAuthSignUp('github')}
            className="bg-dark-3 text-light-1 border border-gray-700 py-2 rounded-md flex items-center justify-center gap-2 hover:bg-dark-1 transition-all"
          >
            <FaGithub size={18} />
            Sign up with GitHub
          </button>
        </div>

        <p className="mt-4 text-gray-400 text-center">
          Already have an account?{' '}
          <a href="/sign-in" className="text-primary-500 hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  )
}
