import { CPUDataPoint } from '@/types/thread';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CPUChartProps {
  data: CPUDataPoint[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="font-mono text-sm text-foreground">
          CPU: <span className="text-primary font-semibold">{payload[0].value.toFixed(1)}%</span>
        </p>
        <p className="font-mono text-sm text-muted-foreground">
          Threads: {payload[0].payload.threadCount}
        </p>
      </div>
    );
  }
  return null;
};

export const CPUChart = ({ data }: CPUChartProps) => {
  const chartData = data.map((point, index) => ({
    ...point,
    time: index,
  }));

  return (
    <div className="w-full h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(187, 100%, 50%)" stopOpacity={0.4} />
              <stop offset="95%" stopColor="hsl(187, 100%, 50%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="hsl(222, 47%, 18%)" 
            vertical={false}
          />
          <XAxis 
            dataKey="time" 
            stroke="hsl(215, 20%, 55%)"
            tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }}
            axisLine={{ stroke: 'hsl(222, 47%, 18%)' }}
            tickLine={false}
          />
          <YAxis 
            domain={[0, 100]}
            stroke="hsl(215, 20%, 55%)"
            tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }}
            axisLine={{ stroke: 'hsl(222, 47%, 18%)' }}
            tickLine={false}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="usage"
            stroke="hsl(187, 100%, 50%)"
            strokeWidth={2}
            fill="url(#cpuGradient)"
            dot={false}
            activeDot={{
              r: 4,
              fill: 'hsl(187, 100%, 50%)',
              stroke: 'hsl(222, 47%, 6%)',
              strokeWidth: 2,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
