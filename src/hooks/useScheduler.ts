import { Thread, ThreadPriority } from '@/types/thread';

// Priority weights - higher priority gets more CPU time
const PRIORITY_WEIGHTS: Record<ThreadPriority, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

export interface SchedulerInfo {
  algorithm: string;
  description: string;
  currentThread: string | null;
  timeQuantum: number;
}

/**
 * Priority Scheduling Algorithm
 * 
 * Why Priority Scheduling?
 * 1. Real-world usage: Linux (CFS with nice values), Windows (priority levels)
 * 2. Efficient for mixed workloads: Critical tasks get more CPU time
 * 3. Preemptive: Higher priority threads can interrupt lower ones
 * 4. Already have priority metadata in our threads
 * 
 * Implementation:
 * - Each priority level gets a weight (critical=4, high=3, medium=2, low=1)
 * - CPU time is distributed proportionally based on weights
 * - Within same priority, Round Robin ensures fairness
 */
export const useScheduler = () => {
  const algorithm = 'Priority Scheduling';
  const description = 'Higher priority threads receive more CPU time. Critical=4x, High=3x, Medium=2x, Low=1x time slices.';

  // Calculate CPU usage based on priority weight
  const calculatePriorityCpuShare = (thread: Thread, allRunningThreads: Thread[]): number => {
    if (thread.state !== 'running') return 0;

    const totalWeight = allRunningThreads
      .filter(t => t.state === 'running')
      .reduce((sum, t) => sum + PRIORITY_WEIGHTS[t.priority], 0);

    if (totalWeight === 0) return 0;

    const threadWeight = PRIORITY_WEIGHTS[thread.priority];
    const baseShare = (threadWeight / totalWeight) * 100;
    
    // Add some variance to simulate real CPU behavior
    const variance = (Math.random() - 0.5) * 10;
    return Math.max(0, Math.min(100, baseShare + variance));
  };

  // Get next thread to execute (highest priority first)
  const getNextThread = (threads: Thread[]): Thread | null => {
    const runningThreads = threads.filter(t => t.state === 'running');
    if (runningThreads.length === 0) return null;

    // Sort by priority (critical first)
    const priorityOrder: ThreadPriority[] = ['critical', 'high', 'medium', 'low'];
    
    for (const priority of priorityOrder) {
      const threadsAtPriority = runningThreads.filter(t => t.priority === priority);
      if (threadsAtPriority.length > 0) {
        // Round Robin within same priority - pick oldest execution time
        return threadsAtPriority.reduce((oldest, current) => 
          current.executionTime < oldest.executionTime ? current : oldest
        );
      }
    }

    return null;
  };

  const getSchedulerInfo = (threads: Thread[]): SchedulerInfo => {
    const nextThread = getNextThread(threads);
    return {
      algorithm,
      description,
      currentThread: nextThread?.name || null,
      timeQuantum: 1000, // 1 second time slices
    };
  };

  return {
    algorithm,
    description,
    calculatePriorityCpuShare,
    getNextThread,
    getSchedulerInfo,
    priorityWeights: PRIORITY_WEIGHTS,
  };
};
