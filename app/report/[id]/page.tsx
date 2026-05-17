'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type ToolEntry = {
  tool: string
  plan: string
  seats: number
  monthlySpend: number
}

const RESELLER_PRICES: Record<string, number> = {
  Cursor: 8,
  ChatGPT: 7,
  Claude: 7,
  'GitHub Copilot': 6,
  Gemini: 7,
}

export default function ReportPage() {
  const { id } = useParams()
  const [entries, setEntries] = useState<ToolEntry[]>([])
  const [totalSavings, setTotalSavings] = useState(0)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const fetchReport = async () => {
      const { data, error } = await supabase
        .from('audits')
        .select('*')
        .eq('id', id)
        .single()

      if (error || !data) {
        setNotFound(true)
      } else {
        setEntries(data.audit_data)
        setTotalSavings(data.total_savings)
      }
      setLoading(false)
    }

    fetchReport()
  }, [id])

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <p className="text-gray-400">Loading report...</p>
      </main>
    )
  }

  if (notFound) {
    return (
      <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <p className="text-gray-400">Report not found.</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white px-4 py-12">
      <div className="max-w-2xl mx-auto">

        <h1 className="text-3xl font-bold text-green-400 mb-2">
          AI Spend Report
        </h1>
        <p className="text-gray-400 mb-8">
          Shared audit report — here's the full breakdown.
        </p>

        <div className="space-y-4 mb-8">
          {entries.map((entry, index) => {
            const resellerPrice = RESELLER_PRICES[entry.tool] ?? entry.monthlySpend
            const currentTotal = entry.monthlySpend * entry.seats
            const resellerTotal = resellerPrice * entry.seats
            const saving = currentTotal - resellerTotal

            return (
              <div key={index} className="bg-gray-900 rounded-xl p-5 border border-gray-800">
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

        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 mb-6">
          <p className="text-gray-400 text-sm mb-1">Total monthly savings</p>
          <p className="text-4xl font-bold text-green-400">
            ${totalSavings.toFixed(0)}/month
          </p>
          <p className="text-green-300 mt-1">
            That's ${(totalSavings * 12).toFixed(0)} saved every year
          </p>
        </div>

        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 text-center">
          <p className="text-white font-semibold mb-2">
            Want to audit your own AI spend?
          </p>
          <p className="text-gray-400 text-sm mb-4">
            Find out how much your team is overpaying in 2 minutes.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-green-500 hover:bg-green-400 text-black font-bold px-6 py-3 rounded-xl transition"
          >
            Start Free Audit →
          </button>
        </div>

      </div>
    </main>
  )
}