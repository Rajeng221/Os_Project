import { useState, useCallback, useEffect, useRef } from 'react';
import { Thread, ThreadState, ThreadPriority, CPUDataPoint, SystemStats } from '@/types/thread';
import { useScheduler } from './useScheduler';

const generateThreadId = () => `thread-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const generateThreadName = (index: number) => {
  const names = ['Worker', 'Handler', 'Processor', 'Manager', 'Service', 'Task', 'Runner', 'Executor'];
  return `${names[Math.floor(Math.random() * names.length)]}-${index}`;
};

const getRandomPriority = (): ThreadPriority => {
  const priorities: ThreadPriority[] = ['low', 'medium', 'high', 'critical'];
  return priorities[Math.floor(Math.random() * priorities.length)];
};

export const useThreadManager = () => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [cpuHistory, setCpuHistory] = useState<CPUDataPoint[]>([]);
  const [isSimulationRunning, setIsSimulationRunning] = useState(true);
  const threadCountRef = useRef(0);
  const { calculatePriorityCpuShare } = useScheduler();

  const createThread = useCallback((customName?: string, priority?: ThreadPriority, customBurstTime?: number, parentId?: string): Thread => {
    threadCountRef.current += 1;
    // Use custom burst time or random between 10-30 seconds
    const burstTime = customBurstTime || (Math.floor(Math.random() * 21) + 10) * 1000;
    const newThread: Thread = {
      id: generateThreadId(),
      name: customName || generateThreadName(threadCountRef.current),
      state: 'running',
      priority: priority || getRandomPriority(),
      cpuUsage: Math.random() * 30 + 5,
      memoryUsage: Math.random() * 100 + 20,
      startTime: new Date(),
      executionTime: 0,
      burstTime,
      parentId,
    };
    
    setThreads(prev => [...prev, newThread]);
    return newThread;
  }, []);

  const deleteThread = useCallback((threadId: string) => {
    setThreads(prev => prev.filter(t => t.id !== threadId && t.parentId !== threadId));
  }, []);

  const updateThreadState = useCallback((threadId: string, newState: ThreadState) => {
    setThreads(prev => prev.map(t => 
      t.id === threadId ? { ...t, state: newState } : t
    ));
  }, []);

  const updateThreadPriority = useCallback((threadId: string, newPriority: ThreadPriority) => {
    setThreads(prev => prev.map(t => 
      t.id === threadId ? { ...t, priority: newPriority } : t
    ));
  }, []);

  const pauseThread = useCallback((threadId: string) => {
    updateThreadState(threadId, 'paused');
  }, [updateThreadState]);

  const resumeThread = useCallback((threadId: string) => {
    updateThreadState(threadId, 'running');
  }, [updateThreadState]);

  const stopThread = useCallback((threadId: string) => {
    updateThreadState(threadId, 'stopped');
  }, [updateThreadState]);

  const pauseAllThreads = useCallback(() => {
    setThreads(prev => prev.map(t => 
      t.state === 'running' ? { ...t, state: 'paused' } : t
    ));
  }, []);

  const resumeAllThreads = useCallback(() => {
    setThreads(prev => prev.map(t => 
      t.state === 'paused' ? { ...t, state: 'running' } : t
    ));
  }, []);

  const stopAllThreads = useCallback(() => {
    setThreads(prev => prev.map(t => ({ ...t, state: 'stopped' })));
  }, []);

  const toggleSimulation = useCallback(() => {
    setIsSimulationRunning(prev => !prev);
  }, []);

  // Simulate CPU usage changes using Priority Scheduling
  useEffect(() => {
    if (!isSimulationRunning) return;

    const interval = setInterval(() => {
      setThreads(prev => {
        const runningThreads = prev.filter(t => t.state === 'running');
        
        return prev.map(thread => {
          if (thread.state !== 'running') return thread;
          
          const newExecutionTime = thread.executionTime + 1000;
          
          // Check if thread should complete (burst time reached)
          if (newExecutionTime >= thread.burstTime) {
            return {
              ...thread,
              state: 'completed' as const,
              cpuUsage: 0,
              executionTime: thread.burstTime,
            };
          }
          
          // Use priority-based CPU allocation
          const newCpuUsage = calculatePriorityCpuShare(thread, runningThreads);
          
          const memoryChange = (Math.random() - 0.5) * 5;
          const newMemoryUsage = Math.max(0, Math.min(500, thread.memoryUsage + memoryChange));
          
          return {
            ...thread,
            cpuUsage: newCpuUsage,
            memoryUsage: newMemoryUsage,
            executionTime: newExecutionTime,
          };
        });
      });

      // Update CPU history
      setCpuHistory(prev => {
        const totalCpu = threads.reduce((acc, t) => 
          t.state === 'running' ? acc + t.cpuUsage : acc, 0
        );
        const newPoint: CPUDataPoint = {
          timestamp: Date.now(),
          usage: Math.min(100, totalCpu),
          threadCount: threads.filter(t => t.state === 'running').length,
        };
        
        const newHistory = [...prev, newPoint];
        return newHistory.slice(-60); // Keep last 60 data points
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isSimulationRunning, threads]);

  // Initialize with some threads
  useEffect(() => {
    for (let i = 0; i < 4; i++) {
      createThread();
    }
  }, []);

  const getSystemStats = useCallback((): SystemStats => {
    return {
      totalThreads: threads.length,
      runningThreads: threads.filter(t => t.state === 'running').length,
      pausedThreads: threads.filter(t => t.state === 'paused').length,
      stoppedThreads: threads.filter(t => t.state === 'stopped').length,
      waitingThreads: threads.filter(t => t.state === 'waiting').length,
      completedThreads: threads.filter(t => t.state === 'completed').length,
      totalCpuUsage: threads.reduce((acc, t) => t.state === 'running' ? acc + t.cpuUsage : acc, 0),
      totalMemoryUsage: threads.reduce((acc, t) => acc + t.memoryUsage, 0),
    };
  }, [threads]);

  return {
    threads,
    cpuHistory,
    isSimulationRunning,
    createThread,
    deleteThread,
    pauseThread,
    resumeThread,
    stopThread,
    updateThreadPriority,
    pauseAllThreads,
    resumeAllThreads,
    stopAllThreads,
    toggleSimulation,
    getSystemStats,
  };
};
