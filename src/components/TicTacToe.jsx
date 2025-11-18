import { useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api'

const emptyBoard = Array(9).fill('')

function Cell({ value, onClick, highlight }) {
  return (
    <button
      onClick={onClick}
      className={`w-20 h-20 md:w-24 md:h-24 text-3xl md:text-4xl font-bold flex items-center justify-center rounded-lg border border-white/20 transition-all ${
        highlight ? 'bg-emerald-500/20 ring-2 ring-emerald-400' : 'bg-white/10 hover:bg-white/20'
      }`}
    >
      <span className="drop-shadow-sm">{value}</span>
    </button>
  )
}

export default function TicTacToe() {
  const [board, setBoard] = useState([...emptyBoard])
  const [human, setHuman] = useState('X')
  const [ai, setAi] = useState('O')
  const [message, setMessage] = useState('Your move!')
  const [winner, setWinner] = useState('')
  const [loading, setLoading] = useState(false)
  const [aiStrategy, setAiStrategy] = useState(null)
  const [metrics, setMetrics] = useState(null)
  const [tree, setTree] = useState(null)

  useEffect(() => {
    // AI goes first if human is O
    if (human === 'O' && !winner && board.every(c => !c)) {
      aiMove([...board])
    }
  }, [human])

  const available = useMemo(() => board.map((v, i) => (v ? false : true)), [board])

  async function aiMove(nextBoard, strategyName) {
    setLoading(true)
    try {
      const res = await api.move({ board: nextBoard, ai_symbol: ai, human_symbol: human, use_strategy: strategyName || aiStrategy?.name, return_tree: true })
      setMetrics(res.metrics)
      setTree(res.tree)
      setBoard(res.board)
      setWinner(res.winner)
      setMessage(res.winner ? (res.winner === 'draw' ? "It's a draw." : `${res.winner} wins!`) : 'Your move!')
    } catch (err) {
      console.error(err)
      setMessage('Error contacting AI backend.')
    } finally {
      setLoading(false)
    }
  }

  function handleCell(i) {
    if (loading || winner || board[i]) return
    const next = [...board]
    next[i] = human
    setBoard(next)
    setMessage('AI thinking...')
    setTimeout(() => aiMove(next), 50)
  }

  function reset() {
    setBoard([...emptyBoard])
    setWinner('')
    setMetrics(null)
    setTree(null)
    setMessage(human === 'X' ? 'Your move!' : 'AI starts...')
    if (human === 'O') {
      setTimeout(() => aiMove([...emptyBoard]), 50)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-white/80">You are</span>
          <select value={human} onChange={e => { const h=e.target.value; setHuman(h); setAi(h==='X'?'O':'X'); reset() }} className="bg-white/10 text-white rounded px-2 py-1 border border-white/20">
            <option value="X">X</option>
            <option value="O">O</option>
          </select>
        </div>
        <div className="text-white/90 font-medium">{message}</div>
        <button onClick={reset} className="px-3 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white">Reset</button>
      </div>

      <div className="grid grid-cols-3 gap-3 w-max mx-auto">
        {board.map((v, i) => (
          <Cell key={i} value={v} onClick={() => handleCell(i)} highlight={false} />
        ))}
      </div>

      {metrics && (
        <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-white text-sm">
          <div className="font-semibold mb-2">Performance</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div>Time: <span className="font-mono">{metrics.time_ms} ms</span></div>
            <div>Memory: <span className="font-mono">{metrics.mem_kb} KB</span></div>
            <div>Nodes: <span className="font-mono">{metrics.nodes}</span></div>
            <div>Eval: <span className="font-mono">{metrics.eval}</span></div>
          </div>
        </div>
      )}

      {tree?.root && (
        <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-white text-sm">
          <div className="font-semibold mb-2">Decision Tree (root children)</div>
          <div className="flex flex-wrap gap-2">
            {tree.root.children?.map((c, idx) => (
              <div key={idx} className="px-2 py-1 bg-white/10 rounded">move {c.move} → {c.value?.toFixed?.(2)}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
