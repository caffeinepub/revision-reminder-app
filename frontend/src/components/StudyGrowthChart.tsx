import { useMemo } from 'react';
import { TrendingUp, BarChart2 } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { useGetStudyProgress } from '@/hooks/useQueries';
import { transformProgressToChartData } from '@/utils/chartHelpers';
import { Skeleton } from '@/components/ui/skeleton';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; payload: { count: number } }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="bg-card border border-border rounded-lg shadow-card px-3 py-2 text-sm font-sans">
      <p className="text-muted-foreground text-xs mb-1">{label}</p>
      <p className="font-semibold text-foreground">
        {payload[0].value} total revised
      </p>
      <p className="text-xs text-muted-foreground">
        +{payload[0].payload.count} this session
      </p>
    </div>
  );
}

export function StudyGrowthChart() {
  const { data: rawProgress = [], isLoading } = useGetStudyProgress();

  const chartData = useMemo(
    () => transformProgressToChartData(rawProgress),
    [rawProgress]
  );

  const totalRevised = chartData.length > 0 ? chartData[chartData.length - 1].cumulative : 0;
  const sessionsCount = chartData.length;

  return (
    <section className="bg-card rounded-xl shadow-card p-6 md:p-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-serif text-xl font-semibold text-foreground">Study Growth</h2>
            <p className="text-sm text-muted-foreground">Cumulative revisions over time</p>
          </div>
        </div>
        {chartData.length > 0 && (
          <div className="text-right">
            <p className="text-2xl font-serif font-bold text-primary">{totalRevised}</p>
            <p className="text-xs text-muted-foreground font-sans">total revised</p>
          </div>
        )}
      </div>

      {/* Stats Row */}
      {chartData.length > 0 && (
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-background rounded-lg border border-border px-4 py-3">
            <p className="text-xs text-muted-foreground font-sans uppercase tracking-wider mb-1">Sessions</p>
            <p className="text-xl font-serif font-semibold text-foreground">{sessionsCount}</p>
          </div>
          <div className="bg-background rounded-lg border border-border px-4 py-3">
            <p className="text-xs text-muted-foreground font-sans uppercase tracking-wider mb-1">Total Revised</p>
            <p className="text-xl font-serif font-semibold text-foreground">{totalRevised}</p>
          </div>
        </div>
      )}

      {/* Chart */}
      {isLoading ? (
        <Skeleton className="h-56 w-full rounded-lg" />
      ) : chartData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-14 text-center">
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
            <BarChart2 className="w-7 h-7 text-muted-foreground/50" />
          </div>
          <p className="font-serif text-lg font-medium text-foreground mb-1">No data yet</p>
          <p className="text-sm text-muted-foreground font-sans max-w-xs">
            Start revising topics to see your study growth chart appear here.
          </p>
        </div>
      ) : (
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="studyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3a7d5a" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#3a7d5a" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8e0d0" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fontFamily: 'Inter, sans-serif', fill: '#8a7a60' }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 10, fontFamily: 'Inter, sans-serif', fill: '#8a7a60' }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="cumulative"
                stroke="#3a7d5a"
                strokeWidth={2.5}
                fill="url(#studyGradient)"
                dot={{ fill: '#3a7d5a', strokeWidth: 0, r: 4 }}
                activeDot={{ fill: '#3a7d5a', strokeWidth: 2, stroke: '#fff', r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
