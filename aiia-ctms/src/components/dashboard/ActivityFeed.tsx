import { CheckCircle2, Clock, FileWarning, AlertTriangle, UserPlus } from 'lucide-react';
import { recentActivity } from '@/data/mockData';

const getIcon = (type: string) => {
  switch (type) {
    case 'enrollment': return <UserPlus className="w-4 h-4 text-emerald-600" />;
    case 'approval': return <CheckCircle2 className="w-4 h-4 text-blue-600" />;
    case 'adverse': return <AlertTriangle className="w-4 h-4 text-red-600" />;
    case 'document': return <FileWarning className="w-4 h-4 text-amber-600" />;
    case 'visit': return <Clock className="w-4 h-4 text-purple-600" />;
    default: return <CheckCircle2 className="w-4 h-4 text-gray-600" />;
  }
};

const getBgColor = (type: string) => {
  switch (type) {
    case 'enrollment': return 'bg-emerald-50';
    case 'approval': return 'bg-blue-50';
    case 'adverse': return 'bg-red-50';
    case 'document': return 'bg-amber-50';
    case 'visit': return 'bg-purple-50';
    default: return 'bg-gray-50';
  }
};

export default function ActivityFeed() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
        <button className="text-sm font-medium text-aiia-blue hover:text-aiia-blue-light">View All</button>
      </div>
      <div className="p-6 flex-1 overflow-y-auto">
        <div className="space-y-6">
          {recentActivity.map((activity, index) => (
            <div key={activity.id} className="relative flex gap-4">
              {/* Timeline connector */}
              {index !== recentActivity.length - 1 && (
                <div className="absolute left-5 top-10 bottom-[-24px] w-[2px] bg-gray-100" />
              )}
              
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${getBgColor(activity.type)} border border-white shadow-sm z-10`}>
                {getIcon(activity.type)}
              </div>
              
              <div className="flex-1 pt-1">
                <div className="flex justify-between items-start mb-1">
                  <p className="text-sm font-bold text-gray-900">{activity.action}</p>
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                    {activity.timestamp.split(' ')[1]}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1 leading-snug">{activity.detail}</p>
                <p className="text-xs font-medium text-gray-400">By {activity.user}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
