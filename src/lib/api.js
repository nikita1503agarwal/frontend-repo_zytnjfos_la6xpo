const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`API ${path} failed: ${res.status} ${res.statusText} - ${text}`)
  }
  return res.json()
}

export const api = {
  move: (payload) => request('/api/game/move', { method: 'POST', body: JSON.stringify(payload) }),
  runGA: (payload) => request('/api/ga/run', { method: 'POST', body: JSON.stringify(payload) }),
  strategies: () => request('/api/strategies'),
  generations: (run_id) => request(`/api/ga/generations${run_id ? `?run_id=${encodeURIComponent(run_id)}` : ''}`),
  saveGame: (payload) => request('/api/games/result', { method: 'POST', body: JSON.stringify(payload) }),
  metricsSummary: () => request('/api/metrics/summary'),
}

export { BASE_URL }
