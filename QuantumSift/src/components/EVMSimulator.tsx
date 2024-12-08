'use client'

import { useState, useCallback } from 'react';
import { EVMStack } from './lib/evm/EVMStack';
import { Opcode, EVMSimulationResult } from './types/evm';
import { Play, RotateCcw, Info, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export default function EVMSimulator() {
  const [stack] = useState(() => new EVMStack({ enableLogging: true }));
  const [opcode, setOpcode] = useState<Opcode>('PUSH1');
  const [value, setValue] = useState('');
  const [simulationResult, setSimulationResult] = useState<EVMSimulationResult | null>(null);
  const [operationHistory, setOperationHistory] = useState<Array<{opcode: Opcode, value?: string}>>([]);

  const handleExecute = useCallback(() => {
    if (opcode === 'PUSH1' && !value) {
      toast.error('Value is required for PUSH1 operation');
      return;
    }

    try {
      const operation = { opcode, value: opcode === 'PUSH1' ? value : undefined };
      const newHistory = [...operationHistory, operation];
      
      const result = stack.simulate(newHistory);
      
      setSimulationResult(result);
      setOperationHistory(newHistory);

      // Success toast
      toast.success(`Executed ${opcode} ${value || ''}`, {
        description: `Stack size: ${result.finalState.stack.length}, Gas used: ${result.gasUsed}`
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Error executing ${opcode}`, {
        description: errorMessage
      });
    }
  }, [opcode, value, operationHistory]);

  const handleReset = () => {
    stack.reset();
    setSimulationResult(null);
    setOperationHistory([]);
    toast.info('EVM Simulator Reset');
  };

  const opcodes: Opcode[] = [
    'PUSH1', 'POP', 'ADD', 'SUB', 
    'MUL', 'DIV', 'CALLER', 'CALLVALUE'
  ];

  return (
    <div className="w-full max-w-5xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <Info className="w-6 h-6 text-blue-600" />
          EVM Simulator
          <span className="ml-auto text-sm text-gray-500">
            Gas Limit: {stack['_config'].maxGasLimit}
          </span>
        </h2>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Opcode
              </label>
              <select
                value={opcode}
                onChange={(e) => setOpcode(e.target.value as Opcode)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {opcodes.map(op => (
                  <option key={op} value={op}>{op}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Value (for PUSH operations)
              </label>
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Hexadecimal or decimal value"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                disabled={opcode !== 'PUSH1'}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleExecute}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Play className="w-5 h-5" />
              Execute
            </button>

            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              <RotateCcw className="w-5 h-5" />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Operation History */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          Operation History
          <span className="text-sm text-gray-500">
            {operationHistory.length} operations
          </span>
        </h3>
        <div className="bg-gray-50 rounded-lg p-4 h-32 overflow-y-auto font-mono text-sm">
          {operationHistory.map((op, i) => (
            <div 
              key={i} 
              className={`py-1 ${
                simulationResult?.success === false && i === operationHistory.length - 1 
                  ? 'text-red-600' 
                  : 'text-gray-800'
              }`}
            >
              {op.opcode} {op.value || ''}
            </div>
          ))}
        </div>
      </div>

      {/* Simulation Result */}
      {simulationResult && (
        <div className={`bg-white rounded-lg shadow-lg p-6 ${
          simulationResult.success ? 'border-green-200' : 'border-red-200 border-2'
        }`}>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            {simulationResult.success ? (
              <Check className="w-6 h-6 text-green-600" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-red-600" />
            )}
            Simulation Result
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-700">Final Stack</h4>
              <pre className="bg-gray-50 p-2 rounded text-sm">
                {JSON.stringify(simulationResult.finalState.stack, null, 2)}
              </pre>
            </div>
            <div>
              <h4 className="font-medium text-gray-700">Simulation Details</h4>
              <div className="space-y-2 text-sm">
                <p>Status: <span className={
                  simulationResult.success ? 'text-green-600' : 'text-red-600'
                }>
                  {simulationResult.success ? 'Success' : 'Failed'}
                </span></p>
                <p>Gas Used: {simulationResult.gasUsed}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
