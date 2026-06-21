import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import LoadingSpinner from '../components/LoadingSpinner'

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

export default function AdminDashboard() {
  const { bankname } = useLocation().state ?? {}
  const navigate = useNavigate()
  const [inventory, setInventory] = useState({})
  const [editing, setEditing] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(null)

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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <LoadingSpinner text="Loading inventory..." />
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{bankname}</h1>
            <p className="text-gray-500 text-sm">Blood Inventory Management</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="text-sm border border-red-200 text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl transition-colors"
          >
            Sign Out
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <p className="text-sm text-gray-500">
              Update the quantity for each blood type. Leave blank if not available.
            </p>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-5 py-3 text-left font-semibold text-gray-600">Blood Type</th>
                <th className="px-5 py-3 text-left font-semibold text-gray-600">Quantity (units)</th>
                <th className="px-5 py-3 text-left font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {BLOOD_TYPES.map((name) => (
                <tr key={name} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <span className="bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                      {name}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <input
                      type="number"
                      min="0"
                      placeholder={inventory[name] !== undefined ? String(inventory[name]) : 'Not set'}
                      value={editing[name] ?? ''}
                      onChange={(e) =>
                        setEditing((prev) => ({ ...prev, [name]: e.target.value }))
                      }
                      className="w-28 border border-gray-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                    />
                    {inventory[name] !== undefined && editing[name] === undefined && (
                      <span className="ml-2 text-gray-400 text-xs">
                        Current: {inventory[name]}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdate(name)}
                        disabled={editing[name] === undefined || saving === name}
                        className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                      >
                        {saving === name ? '...' : '✓ Update'}
                      </button>
                      <button
                        onClick={() => handleDelete(name)}
                        disabled={inventory[name] === undefined || saving === name + '_del'}
                        className="bg-red-100 hover:bg-red-500 hover:text-white disabled:opacity-40 text-red-600 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                      >
                        {saving === name + '_del' ? '...' : '✕ Remove'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
