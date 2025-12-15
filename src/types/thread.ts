export type ThreadState = 'running' | 'paused' | 'stopped' | 'waiting' | 'completed';

export type ThreadPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Thread {
  id: string;
  name: string;
  state: ThreadState;
  priority: ThreadPriority;
  cpuUsage: number;
  memoryUsage: number;
  startTime: Date;
  executionTime: number; // in milliseconds
  burstTime: number; // total time needed to complete (in milliseconds)
  parentId?: string;
}

export interface CPUDataPoint {
  timestamp: number;
  usage: number;
  threadCount: number;
}

export interface SystemStats {
  totalThreads: number;
  runningThreads: number;
  pausedThreads: number;
  stoppedThreads: number;
  waitingThreads: number;
  completedThreads: number;
  totalCpuUsage: number;
  totalMemoryUsage: number;
}
