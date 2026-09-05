import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { sitePerformanceData } from '@/data/mockData';

export default function SitePerformanceChart() {
  return (
    <div className="bg-white rounded-xl p-5" style={{ boxShadow: 'var(--shadow-card)' }}>
      <div className="mb-4">
        <h3 className="text-base font-semibold text-gray-900">
          Site Performance Comparison
        </h3>
        <p className="text-sm text-gray-500 mt-0.5">
          Enrollment progress by site
        </p>
      </div>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sitePerformanceData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: '#94a3b8' }}
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
            <Bar
              dataKey="enrolled"
              name="Enrolled"
              fill="#0f3460"
              radius={[4, 4, 0, 0]}
              barSize={20}
            />
            <Bar
              dataKey="target"
              name="Target"
              fill="#e2e8f0"
              radius={[4, 4, 0, 0]}
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
