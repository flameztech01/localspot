import React, { useState } from 'react'
import { FiSettings, FiTag, FiDatabase, FiCheckCircle, FiPlus, FiTrash2, FiSave } from 'react-icons/fi'

const initialCategories = [
  { id: 1, name: 'Hotels', icon: '🏨', count: 18 },
  { id: 2, name: 'Restaurants', icon: '🍽️', count: 42 },
  { id: 3, name: 'Local Food', icon: '🍲', count: 25 },
  { id: 4, name: 'Bars & Lounges', icon: '🍸', count: 19 },
  { id: 5, name: 'Cafes', icon: '☕', count: 14 },
  { id: 6, name: 'Entertainment', icon: '🎉', count: 11 },
  { id: 7, name: 'Shopping', icon: '🛍️', count: 30 },
  { id: 8, name: 'Beauty & Wellness', icon: '💅', count: 16 },
  { id: 9, name: 'Services', icon: '🛠️', count: 22 },
  { id: 10, name: 'Parks & Recs', icon: '🌳', count: 8 },
]

const AdminSettings = () => {
  const [categories, setCategories] = useState(initialCategories)
  const [newCatName, setNewCatName] = useState('')
  const [newCatIcon, setNewCatIcon] = useState('📍')
  const [savedSuccess, setSavedSuccess] = useState(false)

  const handleAddCategory = (e) => {
    e.preventDefault()
    if (!newCatName.trim()) return

    const newCat = {
      id: Date.now(),
      name: newCatName.trim(),
      icon: newCatIcon || '📍',
      count: 0,
    }

    setCategories([...categories, newCat])
    setNewCatName('')
    setNewCatIcon('📍')
  }

  const handleDeleteCategory = (id) => {
    setCategories((prev) => prev.filter((c) => c.id !== id))
  }

  const handleSaveSettings = () => {
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Platform Settings & Taxonomy</h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
          Configure business categories, moderation rules, and backend connection details.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <FiCheckCircle size={16} />
          Settings updated successfully!
        </div>
      )}

      {/* Category Manager */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
            <FiTag className="text-blue-600" /> Active Place Categories
          </h3>
          <span className="text-xs text-gray-400">{categories.length} total</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2 truncate">
                <span className="text-base">{cat.icon}</span>
                <div className="truncate">
                  <span className="text-xs font-bold text-gray-800 block truncate">
                    {cat.name}
                  </span>
                  <span className="text-[10px] text-gray-400">{cat.count} listings</span>
                </div>
              </div>
              <button
                onClick={() => handleDeleteCategory(cat.id)}
                className="p-1 text-gray-400 hover:text-rose-600 transition-colors shrink-0"
                title="Remove"
              >
                <FiTrash2 size={13} />
              </button>
            </div>
          ))}
        </div>

        {/* Add Category Form */}
        <form
          onSubmit={handleAddCategory}
          className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-3"
        >
          <input
            type="text"
            placeholder="Category Icon (e.g. 🍕)"
            value={newCatIcon}
            onChange={(e) => setNewCatIcon(e.target.value)}
            className="w-full sm:w-28 px-3 py-2 text-xs rounded-xl border border-gray-200"
          />
          <input
            type="text"
            placeholder="New Category Name (e.g. Nightclubs)"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            className="flex-1 px-3 py-2 text-xs rounded-xl border border-gray-200"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-all shrink-0"
          >
            <FiPlus size={14} /> Add Category
          </button>
        </form>
      </div>

      {/* Backend & API Status */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
          <FiDatabase className="text-blue-600" /> API & Environment Configuration
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-1">
            <span className="font-bold text-gray-700 block">VITE_API_URL:</span>
            <span className="font-mono text-gray-600 break-all">
              {import.meta.env.VITE_API_URL || 'http://localhost:5000/api (Default Local)'}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-1">
            <span className="font-bold text-gray-700 block">RTK Query Cache Tags:</span>
            <span className="font-mono text-gray-600">['User', 'Admin', 'Place', 'SavedPlace']</span>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={handleSaveSettings}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-all shadow-sm"
          >
            <FiSave size={15} /> Save Platform Changes
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminSettings
