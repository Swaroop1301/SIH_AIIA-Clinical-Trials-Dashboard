import { useNavigate } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  trend: number;
  trendDirection: 'up' | 'down';
  accentColor: string;
  accentBg: string;
  navigateTo?: string;
}

export default function KPICard({
  label,
  value,
  icon: Icon,
  trend,
  trendDirection,
  accentColor,
  accentBg,
  navigateTo,
}: KPICardProps) {
  const navigate = useNavigate();

  const isPositiveTrend =
    (trendDirection === 'up' && label !== 'Adverse Events' && label !== 'Protocol Deviations') ||
    (trendDirection === 'down' && (label === 'Adverse Events' || label === 'Protocol Deviations'));

  return (
    <div
      className={`bg-white rounded-xl p-5 transition-all duration-200 hover:-translate-y-0.5 group ${
        navigateTo ? 'cursor-pointer' : 'cursor-default'
      }`}
      style={{
        boxShadow: 'var(--shadow-card)',
        borderLeft: `3px solid ${accentColor}`,
      }}
      onClick={() => navigateTo && navigate(navigateTo)}
      role={navigateTo ? 'button' : undefined}
      tabIndex={navigateTo ? 0 : undefined}
      onKeyDown={(e) => { if (navigateTo && (e.key === 'Enter' || e.key === ' ')) navigate(navigateTo); }}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: accentBg }}
        >
          <Icon className="w-5 h-5" style={{ color: accentColor }} strokeWidth={1.8} />
        </div>
        {trend > 0 && (
          <div
            className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
              isPositiveTrend
                ? 'text-emerald-600 bg-emerald-50'
                : 'text-crimson-600 bg-crimson-50'
            }`}
          >
            {trendDirection === 'up' ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {trend}%
          </div>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 mb-0.5">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}
