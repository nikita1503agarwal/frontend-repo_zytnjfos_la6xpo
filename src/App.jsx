import { useEffect, useState } from 'react'
import TicTacToe from './components/TicTacToe'
import GAControls from './components/GAControls'
import { api, BASE_URL } from './lib/api'

function App() {
  const [summary, setSummary] = useState(null)

  useEffect(()=>{ api.metricsSummary().then(setSummary).catch(()=>{}) },[])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>

      <div className="relative min-h-screen p-6 md:p-10">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3 text-white">
            <img src="/flame-icon.svg" className="w-10 h-10" />
            <div>
              <div className="text-xl font-semibold">Adaptive Tic-Tac-Toe</div>
              <div className="text-white/60 text-xs">Backend: {BASE_URL}</div>
            </div>
          </div>
          <a href="/test" className="text-white/80 hover:text-white text-sm underline">System Test</a>
        </header>

        <main className="grid lg:grid-cols-2 gap-6 relative z-10">
          <section className="bg-slate-800/50 border border-blue-500/20 rounded-2xl p-6">
            <h2 className="text-white text-lg font-semibold mb-4">Play</h2>
            <TicTacToe />
          </section>

          <section className="bg-slate-800/50 border border-blue-500/20 rounded-2xl p-6">
            <h2 className="text-white text-lg font-semibold mb-4">Train AI (Genetic Algorithm)</h2>
            <GAControls onBest={() => api.metricsSummary().then(setSummary).catch(()=>{})} />

            {summary && (
              <div className="mt-6 bg-white/5 border border-white/10 rounded p-4 text-white text-sm">
                <div className="font-semibold mb-2">Summary</div>
                {summary.best_strategy ? (
                  <div>
                    <div>Best Strategy: <span className="font-mono">{summary.best_strategy.name}</span> (fitness {summary.best_strategy.fitness?.toFixed?.(2)})</div>
                  </div>
                ) : (
                  <div>No strategy yet. Run GA to produce one.</div>
                )}
              </div>
            )}
          </section>
        </main>

        <footer className="mt-10 text-center text-white/60 text-xs">
          Metrics shown: execution time, memory, node count (search). GA displays convergence across generations.
        </footer>
      </div>
    </div>
  )
}

export default App
