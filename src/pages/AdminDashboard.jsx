import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

function stockLevel(qty) {
  if (qty === undefined) return null
  if (qty === 0) return { label: 'Empty', cls: 'text-zinc-600' }
  if (qty <= 3)  return { label: 'Critical', cls: 'text-red-400' }
  if (qty <= 7)  return { label: 'Low', cls: 'text-yellow-400' }
  return { label: 'Good', cls: 'text-green-400' }
}

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
    axios.get(`/api/blood/inventory?bank=${encodeURIComponent(bankname)}`).then(({ data }) => {
      const map = {}
      data.forEach((item) => { map[item.name] = item.quantity })
      setInventory(map)
      setLoading(false)
    })
  }, [bankname])

  const handleUpdate = async (name) => {
    const val = parseInt(editing[name])
    if (isNaN(val) || val < 0) return
    setSaving(name)
    try {
      await axios.put(`/api/blood/inventory?bank=${encodeURIComponent(bankname)}`, { name, count: val })
      setInventory((prev) => ({ ...prev, [name]: val }))
      setEditing((prev) => { const n = { ...prev }; delete n[name]; return n })
    } finally {
      setSaving(null)
    }
  }

  const handleDelete = async (name) => {
    setSaving(name + '_del')
    try {
      await axios.delete(`/api/blood/inventory/${encodeURIComponent(name)}?bank=${encodeURIComponent(bankname)}`)
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
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <div className="px-5 pt-10 pb-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Blood Bank</p>
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

      <div className="flex-1 bg-zinc-900 rounded-t-3xl px-4 pt-5 pb-10">
        <p className="text-zinc-600 text-xs mb-4 px-1">
          Enter a quantity and tap Save. Tap Clear to remove a blood type from your inventory.
        </p>
        <div className="space-y-2.5">
          {BLOOD_TYPES.map((name) => {
            const level = stockLevel(inventory[name])
            return (
              <div key={name} className="bg-zinc-800 border border-zinc-700/50 rounded-2xl px-4 py-3.5 flex items-center gap-3">
                <div className="bg-red-600 w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-black text-xs">{name}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    {inventory[name] !== undefined ? (
                      <>
                        <span className="text-white font-bold text-sm">{inventory[name]} units</span>
                        {level && <span className={`text-[10px] font-bold uppercase tracking-wide ${level.cls}`}>{level.label}</span>}
                      </>
                    ) : (
                      <span className="text-zinc-600 text-sm">Not in inventory</span>
                    )}
                  </div>
                  <input
                    type="number"
                    min="0"
                    placeholder="Set quantity"
                    value={editing[name] ?? ''}
                    onChange={(e) => setEditing((prev) => ({ ...prev, [name]: e.target.value }))}
                    className="w-full bg-zinc-900 border border-zinc-700 focus:border-red-500 rounded-lg px-3 py-1.5 text-sm text-white placeholder-zinc-600 focus:outline-none transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => handleUpdate(name)}
                    disabled={editing[name] === undefined || editing[name] === '' || saving === name}
                    className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors w-16 text-center"
                  >
                    {saving === name ? '...' : 'Save'}
                  </button>
                  <button
                    onClick={() => handleDelete(name)}
                    disabled={inventory[name] === undefined || saving === name + '_del'}
                    className="bg-zinc-700 hover:bg-red-600 disabled:opacity-30 text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors w-16 text-center"
                  >
                    {saving === name + '_del' ? '...' : 'Clear'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
