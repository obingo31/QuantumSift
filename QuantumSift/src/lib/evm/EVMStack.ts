import { 
  Opcode, 
  EVMStackState, 
  EVMExecutionLog, 
  EVMSimulationResult,
  EVMSimulatorConfig 
} from '../../types/evm';

export class EVMStack {
  private _stack: string[] = [];
  private _memory: string[] = [];
  private _storage: Record<string, string> = {};
  private _logs: EVMExecutionLog[] = [];
  private _config: EVMSimulatorConfig;

  constructor(config?: EVMSimulatorConfig) {
    this._config = {
      maxStackSize: config?.maxStackSize ?? 1024,
      maxGasLimit: config?.maxGasLimit ?? 30000000,
      enableLogging: config?.enableLogging ?? true
    };
  }

  private log(opcode: Opcode, value?: string, result?: string, error?: string) {
    if (this._config.enableLogging) {
      this._logs.push({
        opcode,
        value,
        timestamp: Date.now(),
        result,
        error
      });
    }
  }

  private validateStackOperation(requiredSize: number) {
    if (this._stack.length < requiredSize) {
      throw new Error(`Insufficient stack items. Required: ${requiredSize}, Current: ${this._stack.length}`);
    }
  }

  execute(opcode: Opcode, value?: string): void {
    // Validate stack size before operation
    if (this._stack.length >= (this._config.maxStackSize ?? 1024)) {
      throw new Error('Stack overflow');
    }

    switch (opcode) {
      case 'PUSH1':
        if (!value) throw new Error('PUSH1 requires a value');
        this._stack.push(value);
        this.log(opcode, value, `Pushed ${value}`);
        break;

      case 'POP':
        this.validateStackOperation(1);
        const poppedValue = this._stack.pop();
        this.log(opcode, undefined, `Popped ${poppedValue}`);
        break;

      case 'ADD':
        this.validateStackOperation(2);
        const b = this._stack.pop()!;
        const a = this._stack.pop()!;
        const sum = BigInt(a) + BigInt(b);
        this._stack.push(sum.toString());
        this.log(opcode, undefined, `Added ${a} + ${b} = ${sum}`);
        break;

      case 'CALLER':
        // Simulate a mock caller address
        const mockCallerAddress = '0x1234567890123456789012345678901234567890';
        this._stack.push(mockCallerAddress);
        this.log(opcode, undefined, `Pushed caller address: ${mockCallerAddress}`);
        break;

      default:
        throw new Error(`Unsupported opcode: ${opcode}`);
    }
  }

  getState(): EVMStackState {
    return {
      stack: [...this._stack],
      memory: [...this._memory],
      storage: {...this._storage}
    };
  }

  simulate(operations: Array<{opcode: Opcode, value?: string}>): EVMSimulationResult {
    const initialState = this.getState();
    let gasUsed = 0;
    let success = true;

    try {
      operations.forEach(op => {
        this.execute(op.opcode, op.value);
        // Add basic gas cost simulation
        gasUsed += this.getGasCost(op.opcode);
      });
    } catch (error) {
      success = false;
      this.log('STOP', undefined, undefined, error instanceof Error ? error.message : 'Unknown error');
    }

    return {
      finalState: this.getState(),
      logs: this._logs,
      gasUsed,
      success
    };
  }

  private getGasCost(opcode: Opcode): number {
    const gasCosts: Record<Opcode, number> = {
      'PUSH1': 3,
      'POP': 2,
      'ADD': 3,
      'SUB': 3,
      'MUL': 5,
      'DIV': 5,
      'CALLER': 2,
      'CALLVALUE': 2,
      'STOP': 0,
      'RETURN': 0
    };
    return gasCosts[opcode] || 0;
  }

  reset(): void {
    this._stack = [];
    this._memory = [];
    this._storage = {};
    this._logs = [];
  }
}
