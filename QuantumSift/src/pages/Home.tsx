import React from 'react'
import ContractScanner from '../components/ContractScanner'
import ContractAnalyzer from '../components/ContractAnalyzer'
import ContractVerifier from '../components/ContractVerifier'
import EVMSimulator from '../components/EVMSimulator'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
        QuantumSift: Smart Contract Security Platform
      </h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <ContractScanner />
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <ContractAnalyzer />
          </div>
        </div>
        <div className="space-y-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <ContractVerifier />
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <EVMSimulator />
          </div>
        </div>
      </div>
    </div>
  )
}
