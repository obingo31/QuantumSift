'use client'

import { useState } from 'react';
import { AlertTriangle, Clock, FileCode, Loader2, CheckCircle, XCircle } from 'lucide-react';

interface AnalysisResult {
  address: string;
  executionTime: number;
  hasIssues: boolean;
  functionName?: string;
  error?: string;
}

// Simulated analysis function (in real app, this would call your backend)
const simulateContractAnalysis = async (address: string): Promise<AnalysisResult> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Randomly simulate finding issues or not
  const hasIssues = Math.random() > 0.7;
  
  return {
    address,
    executionTime: Math.random() * 5 + 1, // Random execution time between 1-6 seconds
    hasIssues,
    functionName: hasIssues ? 'transfer' : undefined,
  };
};

export default function ContractAnalyzer() {
  const [addresses, setAddresses] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const handleAnalyze = async () => {
    const addressList = addresses.split('\n').filter(addr => addr.trim());
    if (addressList.length === 0) return;

    setIsAnalyzing(true);
    setResults([]);
    setErrors([]);

    try {
      const analysisResults = await Promise.all(
        addressList.map(async (address) => {
          try {
            return await simulateContractAnalysis(address.trim());
          } catch (error) {
            setErrors(prev => [...prev, `Error analyzing ${address}: ${error}`]);
            return null;
          }
        })
      );

      setResults(analysisResults.filter((result): result is AnalysisResult => result !== null));
    } catch (error) {
      setErrors(prev => [...prev, `General error: ${error}`]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <FileCode className="w-6 h-6" />
        Smart Contract Analyzer
      </h2>

      <div className="space-y-6">
        {/* Input Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contract Addresses (one per line)
          </label>
          <textarea
            value={addresses}
            onChange={(e) => setAddresses(e.target.value)}
            placeholder="0x..."
            className="w-full h-32 px-3 py-2 text-gray-700 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Analyze Button */}
        <button
          onClick={handleAnalyze}
          disabled={!addresses.trim() || isAnalyzing}
          className={`flex items-center justify-center gap-2 w-full py-2 px-4 rounded-lg text-white font-medium ${
            !addresses.trim() || isAnalyzing
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing Contracts...
            </>
          ) : (
            <>
              <AlertTriangle className="w-5 h-5" />
              Analyze Contracts
            </>
          )}
        </button>

        {/* Results Section */}
        {results.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Analysis Results</h3>
            
            <div className="space-y-4">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    result.hasIssues
                      ? 'border-red-200 bg-red-50'
                      : 'border-green-200 bg-green-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {result.hasIssues ? (
                      <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    )}
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-mono text-sm">
                          {result.address}
                        </h4>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          {result.executionTime.toFixed(2)}s
                        </div>
                      </div>

                      {result.hasIssues ? (
                        <p className="mt-2 text-sm text-red-600">
                          Vulnerable function detected: {result.functionName}
                        </p>
                      ) : (
                        <p className="mt-2 text-sm text-green-600">
                          No vulnerable points detected
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Errors Section */}
        {errors.length > 0 && (
          <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
            <h3 className="text-lg font-semibold text-red-900 mb-2">Errors</h3>
            <ul className="list-disc list-inside space-y-1">
              {errors.map((error, index) => (
                <li key={index} className="text-sm text-red-600">{error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
