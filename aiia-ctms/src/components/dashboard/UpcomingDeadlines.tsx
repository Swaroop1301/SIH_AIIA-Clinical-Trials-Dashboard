import { AlertCircle, Clock, CalendarDays } from 'lucide-react';
import { upcomingDeadlines } from '@/data/mockData';

const getUrgencyBadge = (urgency: string) => {
  switch (urgency) {
    case 'high':
      return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200"><AlertCircle className="w-3 h-3" /> High</span>;
    case 'medium':
      return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200"><Clock className="w-3 h-3" /> Medium</span>;
    case 'low':
      return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200"><CalendarDays className="w-3 h-3" /> Low</span>;
    default:
      return null;
  }
};

export default function UpcomingDeadlines() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Upcoming Deadlines</h2>
          <p className="text-sm text-gray-500 mt-1">Tasks requiring attention in the next 30 days</p>
        </div>
        <button className="text-sm font-medium text-aiia-blue hover:text-aiia-blue-light bg-white border border-gray-200 px-4 py-2 rounded-lg shadow-sm">
          View Calendar
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50/50 text-gray-600 font-semibold border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">Task / Event</th>
              <th className="px-6 py-4">Trial ID</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Due Date</th>
              <th className="px-6 py-4 text-right">Urgency</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {upcomingDeadlines.map((deadline) => (
              <tr key={deadline.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">
                  {deadline.title}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                    {deadline.trial}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {deadline.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600 font-medium">
                  {new Date(deadline.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td className="px-6 py-4 text-right">
                  {getUrgencyBadge(deadline.urgency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
