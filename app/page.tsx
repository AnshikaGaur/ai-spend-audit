'use client'

import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-400">
          AI Spend Audit
        </h1>
        <p className="text-gray-400 mt-4 text-lg">
          Find out how much you're overspending on AI tools
        </p>
        <button
          onClick={() => router.push('/audit')}
          className="mt-8 bg-green-500 hover:bg-green-400 text-black font-semibold px-6 py-3 rounded-xl"
        >
          Start Free Audit →
        </button>
      </div>
    </main>
  )
}