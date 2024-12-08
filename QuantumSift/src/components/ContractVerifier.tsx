'use client'

import { useState } from 'react';
import { AlertTriangle, Check, X, Copy, FileCode } from 'lucide-react';
import ContractAnalyzer from './lib/ContractAnalyzer';
import { toast } from 'sonner';
import { ContractVerificationResult } from './types';

export default function ContractVerifier() {
  const [bytecode, setBytecode] = useState('');
  const [result, setResult] = useState<ContractVerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = () => {
    try {
      // Validate bytecode format
      if (!ContractAnalyzer.validateBytecodeFormat(bytecode)) {
        throw new Error('Invalid bytecode format. Must start with 0x and contain only hexadecimal characters.');
      }

      setError(null);
      const analysisResult = ContractAnalyzer.analyzeContract(bytecode);
      
      // Extract additional metadata for toast
      const metadata = ContractAnalyzer.extractMetadata(bytecode);
      
      setResult(analysisResult);

      // Provide additional context via toast
      if (analysisResult.hasIssue) {
        toast.warning('Potential vulnerabilities detected', {
          description: `Contract type: ${
            metadata.isProbablyERC20 ? 'Likely ERC20' : 
            metadata.isProbablyERC721 ? 'Likely ERC721' : 
            'Unknown'
          }, Bytecode length: ${metadata.length}`
        });
      } else {
        toast.success('No significant issues found in contract bytecode');
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
      setResult(null);
    }
  };

  const handleCopyBytecode = () => {
    navigator.clipboard.writeText(bytecode);
    toast.success('Bytecode copied to clipboard');
  };

  return (
    <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <FileCode className="w-6 h-6" />
        Contract Bytecode Verifier
      </h2>

      <div className="space-y-4">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contract Bytecode
          </label>
          <textarea
            value={bytecode}
            onChange={(e) => setBytecode(e.target.value)}
            className="w-full h-32 px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs"
            placeholder="Enter contract bytecode (0x...)"
          />
          {bytecode && (
            <button 
              onClick={handleCopyBytecode}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              title="Copy Bytecode"
            >
              <Copy className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          onClick={handleAnalyze}
          disabled={!bytecode}
          className={`w-full py-2 px-4 rounded-lg text-white font-medium ${
            bytecode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Analyze Bytecode
        </button>

        {error && (
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center gap-2 text-red-700">
              <X className="w-5 h-5" />
              <span className="font-medium">Error: {error}</span>
            </div>
          </div>
        )}

        {result && (
          <div className={`p-4 rounded-lg border ${
            result.hasIssue ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
          }`}>
            <div className="flex items-center gap-2 mb-4">
              {result.hasIssue ? (
                <AlertTriangle className="w-5 h-5 text-red-700" />
              ) : (
                <Check className="w-5 h-5 text-green-700" />
              )}
              <span className={`font-medium ${
                result.hasIssue ? 'text-red-700' : 'text-green-700'
              }`}>
                {result.hasIssue ? 'Issues Detected' : 'No Issues Found'}
              </span>
              <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                result.severity === 'Critical' ? 'bg-red-100 text-red-700' :
                result.severity === 'High' ? 'bg-orange-100 text-orange-700' :
                result.severity === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-green-100 text-green-700'
              }`}>
                {result.severity}
              </span>
            </div>
            
            {result.hasIssue && (
              <ul className="space-y-2 text-red-700">
                {result.details.map((detail, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="mt-1">•</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
