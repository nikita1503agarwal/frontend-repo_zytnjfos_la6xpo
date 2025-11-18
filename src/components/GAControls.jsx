import { useState } from 'react'
import { api } from '../lib/api'

export default function GAControls({ onBest }) {
  const [population, setPopulation] = useState(20)
  const [generations, setGenerations] = useState(10)
  const [mutation, setMutation] = useState(0.2)
  const [k, setK] = useState(3)
  const [running, setRunning] = useState(false)
  const [history, setHistory] = useState([])
  const [best, setBest] = useState(null)

  async function run() {
    setRunning(true)
    setHistory([])
    setBest(null)
    try {
      const res = await api.runGA({ population_size: Number(population), generations: Number(generations), mutation_rate: Number(mutation), tournament_k: Number(k) })
      setHistory(res.generations)
      setBest(res.best_strategy)
      onBest?.(res.best_strategy)
    } catch (e) {
      console.error(e)
    } finally {
      setRunning(false)
    }
  }

  return (
    <div className="space-y-3 text-white">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <label className="flex flex-col text-sm">Population<input type="number" value={population} onChange={e=>setPopulation(e.target.value)} className="mt-1 bg-white/10 border border-white/20 rounded px-2 py-1" /></label>
        <label className="flex flex-col text-sm">Generations<input type="number" value={generations} onChange={e=>setGenerations(e.target.value)} className="mt-1 bg-white/10 border border-white/20 rounded px-2 py-1" /></label>
        <label className="flex flex-col text-sm">Mutation<input type="number" step="0.05" min="0" max="1" value={mutation} onChange={e=>setMutation(e.target.value)} className="mt-1 bg-white/10 border border-white/20 rounded px-2 py-1" /></label>
        <label className="flex flex-col text-sm">Tournament k<input type="number" value={k} onChange={e=>setK(e.target.value)} className="mt-1 bg-white/10 border border-white/20 rounded px-2 py-1" /></label>
      </div>
      <button onClick={run} disabled={running} className="px-3 py-2 rounded bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50">{running ? 'Running...' : 'Run GA'}</button>

      {history.length>0 && (
        <div className="bg-white/5 border border-white/10 rounded p-3 text-sm">
          <div className="font-semibold mb-2">GA Generations</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-auto">
            {history.map((g)=> (
              <div key={g.generation} className="p-2 bg-white/10 rounded">
                <div className="font-mono">gen {g.generation}</div>
                <div>best {g.best_fitness?.toFixed?.(2)} | mean {g.mean_fitness?.toFixed?.(2)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {best && (
        <div className="bg-white/5 border border-white/10 rounded p-3 text-sm">
          <div className="font-semibold mb-2">Best Strategy</div>
          <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(best.weights, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
