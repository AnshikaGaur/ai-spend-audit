'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const AI_TOOLS = [
  {
    name: 'Cursor',
    plans: [
      { name: 'Free', price: 0 },
      { name: 'Pro', price: 20 },
      { name: 'Business', price: 40 },
    ],
  },
  {
    name: 'ChatGPT',
    plans: [
      { name: 'Free', price: 0 },
      { name: 'Plus', price: 20 },
      { name: 'Team', price: 30 },
    ],
  },
  {
    name: 'Claude',
    plans: [
      { name: 'Free', price: 0 },
      { name: 'Pro', price: 20 },
      { name: 'Team', price: 30 },
    ],
  },
  {
    name: 'GitHub Copilot',
    plans: [
      { name: 'Individual', price: 10 },
      { name: 'Business', price: 19 },
    ],
  },
  {
    name: 'Gemini',
    plans: [
      { name: 'Free', price: 0 },
      { name: 'Advanced', price: 20 },
    ],
  },
]

type ToolEntry = {
  tool: string
  plan: string
  seats: number
  monthlySpend: number
}

export default function AuditPage() {
  const router = useRouter()
  const [entries, setEntries] = useState<ToolEntry[]>([
    { tool: 'Cursor', plan: 'Pro', seats: 1, monthlySpend: 20 },
  ])

  const addTool = () => {
    setEntries([...entries, { tool: 'ChatGPT', plan: 'Plus', seats: 1, monthlySpend: 20 }])
  }

  const removeTool = (index: number) => {
    setEntries(entries.filter((_, i) => i !== index))
  }

  const updateEntry = (index: number, field: keyof ToolEntry, value: string | number) => {
    const updated = [...entries]
    if (field === 'tool') {
      const toolData = AI_TOOLS.find(t => t.name === value)
      updated[index] = {
        ...updated[index],
        tool: value as string,
        plan: toolData?.plans[0].name || '',
        monthlySpend: toolData?.plans[0].price || 0,
      }
    } else if (field === 'plan') {
      const toolData = AI_TOOLS.find(t => t.name === updated[index].tool)
      const planData = toolData?.plans.find(p => p.name === value)
      updated[index] = {
        ...updated[index],
        plan: value as string,
        monthlySpend: planData?.price || 0,
      }
    } else {
      updated[index] = { ...updated[index], [field]: value }
    }
    setEntries(updated)
  }

  const totalMonthly = entries.reduce((sum, e) => sum + e.monthlySpend * e.seats, 0)

  const handleSubmit = () => {
    localStorage.setItem('auditData', JSON.stringify(entries))
    router.push('/results')
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-green-400 mb-2">AI Spend Audit</h1>
        <p className="text-gray-400 mb-8">Add all the AI tools your team is currently paying for.</p>

        <div className="space-y-4">
          {entries.map((entry, index) => {
            const toolData = AI_TOOLS.find(t => t.name === entry.tool)
            return (
              <div key={index} className="bg-gray-900 rounded-xl p-5 border border-gray-800">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-400 font-medium">Tool {index + 1}</span>
                  {entries.length > 1 && (
                    <button
                      onClick={() => removeTool(index)}
                      className="text-red-400 text-sm hover:text-red-300"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Tool selector */}
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">AI Tool</label>
                    <select
                      value={entry.tool}
                      onChange={e => updateEntry(index, 'tool', e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
                    >
                      {AI_TOOLS.map(t => (
                        <option key={t.name} value={t.name}>{t.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Plan selector */}
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Plan</label>
                    <select
                      value={entry.plan}
                      onChange={e => updateEntry(index, 'plan', e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
                    >
                      {toolData?.plans.map(p => (
                        <option key={p.name} value={p.name}>{p.name} — ${p.price}/mo</option>
                      ))}
                    </select>
                  </div>

                  {/* Seats */}
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Number of Seats</label>
                    <input
                      type="number"
                      min={1}
                      value={entry.seats}
                      onChange={e => updateEntry(index, 'seats', parseInt(e.target.value) || 1)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
                    />
                  </div>

                  {/* Monthly spend */}
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Monthly Spend per Seat ($)</label>
                    <input
                      type="number"
                      min={0}
                      value={entry.monthlySpend}
                      onChange={e => updateEntry(index, 'monthlySpend', parseFloat(e.target.value) || 0)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Add tool button */}
        <button
          onClick={addTool}
          className="mt-4 w-full border border-dashed border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 rounded-xl py-3 text-sm transition"
        >
          + Add another tool
        </button>

        {/* Total */}
        <div className="mt-6 bg-gray-900 rounded-xl p-4 border border-gray-800 flex justify-between items-center">
          <span className="text-gray-400">Total monthly spend</span>
          <span className="text-2xl font-bold text-white">${totalMonthly.toFixed(2)}</span>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="mt-4 w-full bg-green-500 hover:bg-green-400 text-black font-bold py-4 rounded-xl text-lg transition"
        >
          Calculate My Savings →
        </button>
      </div>
    </main>
  )
}