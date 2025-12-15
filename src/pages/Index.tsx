import { useThreadManager } from '@/hooks/useThreadManager';
import { SystemStats } from '@/components/thread/SystemStats';
import { CPUChart } from '@/components/thread/CPUChart';
import { ThreadControls } from '@/components/thread/ThreadControls';
import { ThreadList } from '@/components/thread/ThreadList';
import { SchedulerInfo } from '@/components/thread/SchedulerInfo';
import { ThreadTimeline } from '@/components/thread/ThreadTimeline';
import { Cpu, GitBranch, Terminal } from 'lucide-react';

const Index = () => {
  const {
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
  } = useThreadManager();

  const stats = getSystemStats();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center glow-primary">
                <GitBranch className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                  Thread Manager
                  <span className="text-primary font-mono text-sm font-normal">v1.0</span>
                </h1>
                <p className="text-sm text-muted-foreground">
                  Scalable Thread Management System
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 bg-secondary rounded-lg px-3 py-2">
              <Terminal className="h-4 w-4 text-primary" />
              <span className="font-mono text-sm text-foreground">
                OS Project - Operating System
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* System Stats */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Cpu className="h-5 w-5 text-primary" />
            System Overview
          </h2>
          <SystemStats stats={stats} />
        </section>

        {/* CPU Chart and Scheduler Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 bg-card border border-border rounded-lg p-4">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Real-Time CPU Usage
            </h2>
            <CPUChart data={cpuHistory} />
          </section>
          
          <section>
            <SchedulerInfo threads={threads} />
          </section>
        </div>

        {/* Thread Timeline */}
        <section>
          <ThreadTimeline threads={threads} />
        </section>

        {/* Thread Controls */}
        <section className="bg-card border border-border rounded-lg p-4">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Thread Controls
          </h2>
          <ThreadControls
            isSimulationRunning={isSimulationRunning}
            onCreateThread={createThread}
            onPauseAll={pauseAllThreads}
            onResumeAll={resumeAllThreads}
            onStopAll={stopAllThreads}
            onToggleSimulation={toggleSimulation}
          />
        </section>

        {/* Thread List */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">
              Active Threads ({threads.length})
            </h2>
          </div>
          <ThreadList
            threads={threads}
            onPause={pauseThread}
            onResume={resumeThread}
            onStop={stopThread}
            onDelete={deleteThread}
            onPriorityChange={updateThreadPriority}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 mt-8">
        <div className="container mx-auto px-4 py-4">
          <p className="text-center text-sm text-muted-foreground font-mono">
            Scalable Thread Management Library • Operating System Project
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
