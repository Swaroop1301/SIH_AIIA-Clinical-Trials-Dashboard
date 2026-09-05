import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { enrollmentData } from '@/data/mockData';

export default function EnrollmentChart() {
  return (
    <div className="bg-white rounded-xl p-5" style={{ boxShadow: 'var(--shadow-card)' }}>
      <div className="mb-4">
        <h3 className="text-base font-semibold text-gray-900">
          Trial Enrollment Over Time
        </h3>
        <p className="text-sm text-gray-500 mt-0.5">
          Monthly cumulative enrollment vs target
        </p>
      </div>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={enrollmentData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="enrolledGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0f3460" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#0f3460" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="targetGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: '#94a3b8' }}
              axisLine={{ stroke: '#e2e8f0' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                fontSize: '13px',
              }}
            />
            <Legend
              verticalAlign="top"
              align="right"
              height={36}
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '12px', color: '#64748b' }}
            />
            <Area
              type="monotone"
              dataKey="enrolled"
              name="Enrolled"
              stroke="#0f3460"
              strokeWidth={2}
              fill="url(#enrolledGradient)"
              dot={{ r: 3, fill: '#0f3460', strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#0f3460', strokeWidth: 2, stroke: '#fff' }}
            />
            <Area
              type="monotone"
              dataKey="target"
              name="Target"
              stroke="#14b8a6"
              strokeWidth={2}
              strokeDasharray="5 5"
              fill="url(#targetGradient)"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
