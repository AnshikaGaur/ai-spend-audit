'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type ToolEntry = {
  tool: string
  plan: string
  seats: number
  monthlySpend: number
}

// Real reseller prices based on platforms like GamsGo
const RESELLER_PRICES: Record<string, number> = {
  Cursor: 8,
  ChatGPT: 7,
  Claude: 7,
  'GitHub Copilot': 6,
  Gemini: 7,
}

export default function ResultsPage() {
  const router = useRouter()
  const [entries, setEntries] = useState<ToolEntry[]>([])

  useEffect(() => {
    const data = localStorage.getItem('auditData')
    if (data) setEntries(JSON.parse(data))
  }, [])

  const totalMonthly = entries.reduce(
    (sum, e) => sum + e.monthlySpend * e.seats, 0
  )
  const totalWithReseller = entries.reduce((sum, e) => {
    const resellerPrice = RESELLER_PRICES[e.tool] ?? e.monthlySpend
    return sum + resellerPrice * e.seats
  }, 0)

  const monthlySavings = totalMonthly - totalWithReseller
  const yearlySavings = monthlySavings * 12

  if (entries.length === 0) {
    return (
      <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">No audit data found.</p>
          <button
            onClick={() => router.push('/audit')}
            className="bg-green-500 text-black font-bold px-6 py-3 rounded-xl"
          >
            Start Audit
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white px-4 py-12">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <h1 className="text-3xl font-bold text-green-400 mb-2">
          Your Audit Results
        </h1>
        <p className="text-gray-400 mb-8">
          Here's where your money is going — and how much you could save.
        </p>

        {/* Per tool breakdown */}
        <div className="space-y-4 mb-8">
          {entries.map((entry, index) => {
            const resellerPrice = RESELLER_PRICES[entry.tool] ?? entry.monthlySpend
            const currentTotal = entry.monthlySpend * entry.seats
            const resellerTotal = resellerPrice * entry.seats
            const saving = currentTotal - resellerTotal

            return (
              <div
                key={index}
                className="bg-gray-900 rounded-xl p-5 border border-gray-800"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-semibold text-white">{entry.tool}</p>
                    <p className="text-sm text-gray-500">
                      {entry.plan} · {entry.seats} seat{entry.seats > 1 ? 's' : ''}
                    </p>
                  </div>
                  {saving > 0 ? (
                    <span className="bg-red-500/10 text-red-400 text-xs font-semibold px-3 py-1 rounded-full">
                      Overpaying
                    </span>
                  ) : (
                    <span className="bg-gray-700 text-gray-400 text-xs font-semibold px-3 py-1 rounded-full">
                      Good deal
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-gray-800 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">You pay</p>
                    <p className="text-white font-bold">${currentTotal}/mo</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Reseller price</p>
                    <p className="text-green-400 font-bold">${resellerTotal}/mo</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">You save</p>
                    <p className={saving > 0 ? 'text-green-400 font-bold' : 'text-gray-400 font-bold'}>
                      ${saving}/mo
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Total savings box */}
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 mb-6">
          <p className="text-gray-400 text-sm mb-1">Total you could save</p>
          <p className="text-4xl font-bold text-green-400">
            ${monthlySavings.toFixed(0)}/month
          </p>
          <p className="text-green-300 mt-1">
            That's ${yearlySavings.toFixed(0)} saved every year
          </p>
        </div>

        {/* What you currently pay vs reseller */}
        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800 mb-6">
          <div className="flex justify-between mb-3">
            <span className="text-gray-400">What you pay now</span>
            <span className="font-bold text-white">${totalMonthly.toFixed(0)}/mo</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">With a reseller</span>
            <span className="font-bold text-green-400">${totalWithReseller.toFixed(0)}/mo</span>
          </div>
        </div>

        {/* Buttons */}
        <button
          onClick={() => router.push('/audit')}
          className="w-full border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 rounded-xl py-3 text-sm transition mb-3"
        >
          ← Edit my tools
        </button>

        <button className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-4 rounded-xl text-lg transition">
          Get Full Report → (Enter Email)
        </button>

      </div>
    </main>
  )
}