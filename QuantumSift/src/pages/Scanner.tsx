import React from 'react'
import ContractScanner from '../components/ContractScanner'

export default function Scanner() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
        Smart Contract Scanner
      </h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <ContractScanner />
      </div>
    </div>
  )
}
