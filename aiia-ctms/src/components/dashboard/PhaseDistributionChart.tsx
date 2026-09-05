import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { phaseDistributionData } from '@/data/mockData';

export default function PhaseDistributionChart() {
  const total = phaseDistributionData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white rounded-xl p-5" style={{ boxShadow: 'var(--shadow-card)' }}>
      <div className="mb-4">
        <h3 className="text-base font-semibold text-gray-900">
          Trial Phase Distribution
        </h3>
        <p className="text-sm text-gray-500 mt-0.5">
          Active trials by clinical phase
        </p>
      </div>
      <div className="flex items-center gap-6">
        <div className="h-[200px] w-[200px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={phaseDistributionData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {phaseDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  fontSize: '13px',
                }}
                formatter={(value, name) => [`${value} trials`, name]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-3">
          {phaseDistributionData.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-600">{item.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-900">{item.value}</span>
                <span className="text-xs text-gray-400 w-10 text-right">
                  {Math.round((item.value / total) * 100)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
