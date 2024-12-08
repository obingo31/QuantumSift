export interface BugBounty {
  id: string;
  title: string;
  description: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  platform: string;
  status: 'Open' | 'In Review' | 'Resolved';
  bountyAmount?: number;
}

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
}

export interface AnalysisResult {
  hasVulnerability: boolean;
  details: string[];
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
}

export interface FullAnalysisResult {
  hasIssue: boolean;
  details: string[];
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
}

export interface ScanResult {
  address: string;
  executionTime: number;
  vulnerablePoint: boolean;
  function?: string;
  error?: string;
  status: 'success' | 'error';
}

export type Opcode = 
  | 'PUSH1'
  | 'POP'
  | 'ADD'
  | 'CALLER'
  // Add more opcodes as needed

// Utility type for severity levels
export type SeverityLevel = 'Critical' | 'High' | 'Medium' | 'Low';

// Utility type for status
export type BountyStatus = 'Open' | 'In Review' | 'Resolved';

// Helper function to validate severity
export function isValidSeverity(severity: string): severity is SeverityLevel {
  return ['Critical', 'High', 'Medium', 'Low'].includes(severity);
}

// Helper function to validate bounty status
export function isValidBountyStatus(status: string): status is BountyStatus {
  return ['Open', 'In Review', 'Resolved'].includes(status);
}
