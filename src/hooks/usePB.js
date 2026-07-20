import {useState, useEffect} from 'preact/hooks'
import pb from '../utils/pb'

function parseTech(raw) {
  if (!raw) return []
  if (Array.isArray(raw)) return raw
  try {
    return JSON.parse(raw)
  } catch {
    return raw.split(',').map(s => s.trim()).filter(Boolean)
  }
}

export function usePB(collection, options = {}) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    pb.collection(collection).getFullList({...options, requestKey: null})
      .then(records => {
        if (!cancelled) setData(records)
      })
      .catch(err => {
        if (!cancelled) setError(err)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [collection])

  return {data, loading, error}
}

export {parseTech}
