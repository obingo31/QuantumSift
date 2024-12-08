import React from 'react'
import AdminBugReports from '../components/AdminBugReports'

export default function Admin() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
        Admin Dashboard
      </h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <AdminBugReports />
      </div>
    </div>
  )
}
