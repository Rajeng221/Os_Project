import { SystemStats as SystemStatsType } from '@/types/thread';
import { Cpu, Layers, Play, Pause, Square, Clock, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SystemStatsProps {
  stats: SystemStatsType;
}

export const SystemStats = ({ stats }: SystemStatsProps) => {
  const statItems = [
    {
      label: 'Total Threads',
      value: stats.totalThreads,
      icon: Layers,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Running',
      value: stats.runningThreads,
      icon: Play,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      label: 'Paused',
      value: stats.pausedThreads,
      icon: Pause,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      label: 'Completed',
      value: stats.completedThreads,
      icon: CheckCircle2,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'CPU Usage',
      value: `${Math.min(100, stats.totalCpuUsage).toFixed(1)}%`,
      icon: Cpu,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Memory',
      value: `${stats.totalMemoryUsage.toFixed(0)}MB`,
      icon: Clock,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statItems.map((item) => (
        <div
          key={item.label}
          className="bg-card border border-border rounded-lg p-4 transition-all duration-300 hover:border-primary/50"
        >
          <div className="flex items-center gap-3">
            <div className={cn('p-2 rounded-lg', item.bgColor)}>
              <item.icon className={cn('h-5 w-5', item.color)} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="font-mono text-lg font-bold text-foreground">
                {item.value}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
