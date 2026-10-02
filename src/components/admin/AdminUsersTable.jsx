import React, { useState } from 'react'
import { FiUsers, FiSearch, FiShield, FiUserCheck, FiUserX, FiMail, FiPhone } from 'react-icons/fi'

const sampleUsers = [
  {
    id: 'u-1',
    name: 'Gabriel Adeyemi',
    email: 'gabriel@localspot.ng',
    role: 'Admin',
    phone: '+234 802 345 6789',
    status: 'Active',
    joined: 'Jan 15, 2026',
    listingsCount: 0,
  },
  {
    id: 'u-2',
    name: 'Chef Tony Dike',
    email: 'tony@royalcrownbistro.com',
    role: 'Merchant / Business',
    phone: '+234 803 987 6543',
    status: 'Active',
    joined: 'Feb 03, 2026',
    listingsCount: 2,
  },
  {
    id: 'u-3',
    name: 'Elena Vance',
    email: 'elena.vance@gmail.com',
    role: 'Member',
    phone: '+234 812 444 3210',
    status: 'Active',
    joined: 'Feb 20, 2026',
    listingsCount: 0,
  },
  {
    id: 'u-4',
    name: 'David West',
    email: 'david@sparkautomotors.ng',
    role: 'Merchant / Business',
    phone: '+234 809 111 2233',
    status: 'Active',
    joined: 'Mar 01, 2026',
    listingsCount: 1,
  },
]

const AdminUsersTable = () => {
  const [users, setUsers] = useState(sampleUsers)
  const [search, setSearch] = useState('')

  const toggleStatus = (id) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u
      )
    )
  }

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">User & Merchant Accounts</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Manage permissions, platform roles, and merchant privileges.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
          <input
            type="text"
            placeholder="Search users by name, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="px-5 py-3.5">User</th>
                <th className="px-5 py-3.5">Role</th>
                <th className="px-5 py-3.5">Contact</th>
                <th className="px-5 py-3.5">Registered</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {filtered.map((u) => {
                const isAdmin = u.role === 'Admin'
                const isMerchant = u.role.includes('Merchant')

                return (
                  <tr key={u.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{u.name}</p>
                          <p className="text-[11px] text-gray-400">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isAdmin
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : isMerchant
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {isAdmin && <FiShield size={10} />}
                        {u.role}
                      </span>
                    </td>

                    <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">
                      {u.phone || '—'}
                    </td>

                    <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">
                      {u.joined}
                    </td>

                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          u.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>

                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      {!isAdmin && (
                        <button
                          onClick={() => toggleStatus(u.id)}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors ${
                            u.status === 'Active'
                              ? 'text-rose-600 hover:bg-rose-50'
                              : 'text-emerald-600 hover:bg-emerald-50'
                          }`}
                        >
                          {u.status === 'Active' ? 'Suspend' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminUsersTable
