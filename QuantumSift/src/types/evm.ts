// Ethereum Virtual Machine (EVM) Types and Interfaces

export type Opcode = 
  | 'PUSH1' 
  | 'POP' 
  | 'ADD' 
  | 'SUB' 
  | 'MUL' 
  | 'DIV' 
  | 'CALLER' 
  | 'CALLVALUE' 
  | 'STOP' 
  | 'RETURN';

export interface SymbolicValue {
  annotation: string;
  uid: number;
  type: 'bitvec' | 'memory' | 'bool';
  size?: number;
  value: any;
  taint: SymbolicValue | null;
  sloadTaint: SymbolicValue[];
}

export interface EVMStackState {
  stack: string[];
  memory: string[];
  storage: Record<string, string>;
  symbolicValues?: SymbolicValue[];
}

export interface EVMExecutionLog {
  opcode: Opcode;
  value?: string;
  timestamp: number;
  result?: string;
  error?: string;
  symbolicValue?: SymbolicValue;
}

export interface EVMSimulationResult {
  finalState: EVMStackState;
  logs: EVMExecutionLog[];
  gasUsed: number;
  success: boolean;
  vulnerabilityDetected?: boolean;
  vulnerabilityDetails?: string[];
  severity?: 'Critical' | 'High' | 'Medium' | 'Low';
}

export interface EVMSimulatorConfig {
  maxStackSize?: number;
  maxGasLimit?: number;
  enableLogging?: boolean;
  enableSymbolicExecution?: boolean;
}

export interface ContractBytecodeAnalysis {
  address: string;
  bytecode: string;
  analysis: {
    hasVulnerability: boolean;
    details: string[];
    severity: 'Critical' | 'High' | 'Medium' | 'Low';
  };
  executionTime: number;
  status: 'success' | 'error';
}

export interface EVMVulnerabilityPattern {
  id: string;
  name: string;
  description: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  detectionLogic: string;
  remediation: string;
}
