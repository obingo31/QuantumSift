'use client'

import { useState } from 'react'
import AdminBugReports from '../components/AdminBugReports'
import ChatInterface from '../components/ChatInterface'
import ContractAnalyzer from '../components/ContractAnalyzer'
import ContractLibraryScanner from '../components/ContractLibraryScanner'
import ContractScanner from '../components/ContractScanner'
import ContractVerifier from '../components/ContractVerifier'
import EVMSimulator from '../components/EVMSimulator'
import { BugBounty } from '../types'

export default function Home() {
  const [bounties, setBounties] = useState<BugBounty[]>([])

  const handleBountyUpdate = (updatedBounties: BugBounty[]) => {
    setBounties(updatedBounties)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="z-10 w-full max-w-7xl items-center justify-between">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-white">Smart Contract Security Analysis Platform</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Empowering developers and auditors to identify, report, and resolve smart contract vulnerabilities efficiently.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-2xl p-8">
              <AdminBugReports onBountyUpdate={handleBountyUpdate} />
            </div>
            <div className="bg-white rounded-lg shadow-2xl p-8">
              <ContractAnalyzer />
            </div>
            <div className="bg-white rounded-lg shadow-2xl p-8">
              <ContractScanner />
            </div>
          </div>
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-2xl p-8">
              <ContractLibraryScanner />
            </div>
            <div className="bg-white rounded-lg shadow-2xl p-8">
              <ContractVerifier />
            </div>
            <div className="bg-white rounded-lg shadow-2xl p-8">
              <EVMSimulator />
            </div>
            <div>
              <ChatInterface bounties={bounties} />
            </div>
          </div>
        </div>
      </div>
      <footer className="mt-16 text-center text-gray-400">
        <p>&copy; 2023 Smart Contract Security Analysis Platform. All rights reserved.</p>
      </footer>
    </main>
  )
}
