'use client'

import { useState } from 'react';
import { Loader2, AlertTriangle, Check, Clock, FileCode, PlayCircle } from 'lucide-react';
import { ScanResult } from './types';
import { toast } from 'sonner';

export default function ContractScanner() {
  const [addresses, setAddresses] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<ScanResult[]>([]);

  const handleScan = async () => {
    // Validate input
    const addressList = addresses.split('\n').filter(addr => addr.trim());
    
    if (addressList.length === 0) {
      toast.error('Please enter at least one contract address');
      return;
    }

    setIsScanning(true);
    setResults([]);

    // Simulated analysis - in a real app this would call your backend
    const simulatedResults: ScanResult[] = [];
    
    for (const address of addressList) {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Simulate random results with more nuanced vulnerability detection
        const executionTime = Math.random() * 5 + 1;
        const vulnerabilityTypes = [
          'Reentrancy', 
          'Integer Overflow', 
          'Access Control', 
          'Unchecked External Call'
        ];
        
        const hasVulnerability = Math.random() > 0.7;
        
        simulatedResults.push({
          address: address.trim(),
          executionTime,
          vulnerablePoint: hasVulnerability,
          function: hasVulnerability 
            ? vulnerabilityTypes[Math.floor(Math.random() * vulnerabilityTypes.length)] 
            : undefined,
          status: 'success'
        });
      } catch (error) {
        simulatedResults.push({
          address: address.trim(),
          executionTime: 0,
          vulnerablePoint: false,
          error: 'Failed to analyze contract',
          status: 'error'
        });
      }
    }

    setResults(simulatedResults);
    setIsScanning(false);

    // Provide toast notifications based on scan results
    const vulnerableContracts = simulatedResults.filter(r => r.vulnerablePoint);
    if (vulnerableContracts.length > 0) {
      toast.warning(`${vulnerableContracts.length} contract(s) have potential vulnerabilities`);
    } else {
      toast.success('No vulnerabilities detected in scanned contracts');
    }
  };

  return (
    <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <FileCode className="w-6 h-6" />
        Contract Scanner
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
            className="w-full h-32 px-3 py-2 text-gray-700 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Paste contract addresses here (0x...)
Supports multiple addresses, one per line"
            spellCheck="false"
          />
        </div>

        <button
          onClick={handleScan}
          disabled={!addresses.trim() || isScanning}
          className={`flex items-center justify-center gap-2 w-full py-2 px-4 rounded-lg text-white font-medium ${
            !addresses.trim() || isScanning
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isScanning ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Scanning Contracts...
            </>
          ) : (
            <>
              <PlayCircle className="w-5 h-5" />
              Start Scan
            </>
          )}
        </button>

        {/* Results Section */}
        {results.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Scan Results</h3>
            
            <div className="space-y-4">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    result.status === 'error'
                      ? 'border-red-200 bg-red-50'
                      : result.vulnerablePoint
                      ? 'border-yellow-200 bg-yellow-50'
                      : 'border-green-200 bg-green-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {result.status === 'error' ? (
                      <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                    ) : result.vulnerablePoint ? (
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    ) : (
                      <Check className="w-5 h-5 text-green-600 mt-0.5" />
                    )}
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-mono text-sm truncate max-w-[70%]">
                          {result.address}
                        </h4>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          {result.executionTime.toFixed(2)}s
                        </div>
                      </div>

                      {result.status === 'error' ? (
                        <p className="mt-2 text-sm text-red-600">{result.error}</p>
                      ) : result.vulnerablePoint ? (
                        <div className="mt-2">
                          <p className="text-sm text-yellow-700">
                            Potential Vulnerability Detected: {result.function}
                          </p>
                          <p className="text-xs text-yellow-600 mt-1">
                            Recommended: Conduct a thorough security audit
                          </p>
                        </div>
                      ) : (
                        <p className="mt-2 text-sm text-green-600">
                          No Vulnerabilities Detected
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
