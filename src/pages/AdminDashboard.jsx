import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

export default function AdminDashboard() {
  const location = useLocation()
  const navigate = useNavigate()
  const banknameFromState = location.state?.bankname
  const bankname = banknameFromState ?? localStorage.getItem('bankname') ?? null
  const [inventory, setInventory] = useState({})
  const [editing, setEditing] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(null)

  useEffect(() => {
    if (banknameFromState) localStorage.setItem('bankname', banknameFromState)
  }, [banknameFromState])

  useEffect(() => {
    if (!bankname) { navigate('/admin'); return }
    axios.get(`/api/blood/inventory?bank=${bankname}`).then(({ data }) => {
      const map = {}
      data.forEach((item) => { map[item.name] = item.quantity })
      setInventory(map)
      setLoading(false)
    })
  }, [bankname])

  const handleUpdate = async (name) => {
    if (editing[name] === undefined) return
    setSaving(name)
    try {
      await axios.put(`/api/blood/inventory?bank=${bankname}`, {
        name,
        count: parseInt(editing[name]),
      })
      setInventory((prev) => ({ ...prev, [name]: parseInt(editing[name]) }))
      setEditing((prev) => { const n = { ...prev }; delete n[name]; return n })
    } finally {
      setSaving(null)
    }
  }

  const handleDelete = async (name) => {
    setSaving(name + '_del')
    try {
      await axios.delete(`/api/blood/inventory/${encodeURIComponent(name)}?bank=${bankname}`)
      setInventory((prev) => { const n = { ...prev }; delete n[name]; return n })
    } finally {
      setSaving(null)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-zinc-500 text-sm">Loading inventory...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Dark header */}
      <div className="bg-zinc-950 px-5 pt-10 pb-8">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest mb-1">Blood Bank</p>
            <h1 className="text-2xl font-black text-white leading-tight">{bankname}</h1>
            <p className="text-zinc-500 text-sm mt-0.5">Inventory Management</p>
          </div>
          <button
            onClick={() => { localStorage.removeItem('bankname'); navigate('/') }}
            className="border border-zinc-800 hover:border-zinc-600 text-zinc-500 hover:text-zinc-300 text-sm font-medium px-4 py-2 rounded-xl transition-colors mt-1"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Inventory cards */}
      <div className="flex-1 px-4 pt-4 pb-10">
        <p className="text-gray-400 text-xs mb-4 px-1">
          Tap a row to update quantity. Set to 0 or remove if unavailable.
        </p>
        <div className="space-y-2">
          {BLOOD_TYPES.map((name) => (
            <div
              key={name}
              className="border border-gray-100 rounded-2xl px-4 py-3.5 flex items-center gap-3"
            >
              {/* Blood type badge */}
              <div className="bg-red-600 w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white font-black text-xs">{name}</span>
              </div>

              {/* Current qty */}
              <div className="flex-1 min-w-0">
                <p className="text-gray-500 text-xs mb-1">
                  {inventory[name] !== undefined
                    ? <span className="text-gray-800 font-bold">{inventory[name]} units</span>
                    : <span className="text-gray-300">Not set</span>
                  }
                </p>
                <input
                  type="number"
                  min="0"
                  placeholder="Enter quantity"
                  value={editing[name] ?? ''}
                  onChange={(e) => setEditing((prev) => ({ ...prev, [name]: e.target.value }))}
                  className="w-full border border-gray-200 focus:border-red-500 rounded-lg px-3 py-1.5 text-sm text-gray-800 focus:outline-none transition-colors"
                />
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-1.5 flex-shrink-0">
                <button
                  onClick={() => handleUpdate(name)}
                  disabled={editing[name] === undefined || saving === name}
                  className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-30 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors w-16 text-center"
                >
                  {saving === name ? '...' : 'Save'}
                </button>
                <button
                  onClick={() => handleDelete(name)}
                  disabled={inventory[name] === undefined || saving === name + '_del'}
                  className="bg-gray-100 hover:bg-red-500 hover:text-white disabled:opacity-30 text-gray-500 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors w-16 text-center"
                >
                  {saving === name + '_del' ? '...' : 'Clear'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
