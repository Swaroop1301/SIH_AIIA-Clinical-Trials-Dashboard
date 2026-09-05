import {
  FlaskConical,
  Users,
  Building2,
  FileCheck,
} from 'lucide-react';
import KPICard from '@/components/dashboard/KPICard';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import UpcomingDeadlines from '@/components/dashboard/UpcomingDeadlines';
import { kpiData } from '@/data/mockData';

const kpiConfig = [
  { icon: FlaskConical, color: '#1b2f5b', bg: '#f0f4f8', navigateTo: '/app/trials' },
  { icon: Users, color: '#1b2f5b', bg: '#f0f4f8', navigateTo: '/app/participants' },
  { icon: Building2, color: '#1b2f5b', bg: '#f0f4f8', navigateTo: '/app/sites' },
  { icon: FileCheck, color: '#1b2f5b', bg: '#f0f4f8', navigateTo: '/app/ethics' },
];

const officials = [
  {
    name: 'Shri Narendra Modi',
    title: "Hon'ble Prime Minister of India",
    image: 'https://upload.wikimedia.org/wikipedia/commons/8/80/Prime_Minister_Shri_Narendra_Modi_in_New_Delhi_on_August_08%2C_2019_%28cropped%29.jpg',
  },
  {
    name: 'Shri Prataprao Jadhav',
    title: "Hon'ble Minister of State (Independent Charge)\nMinistry of Ayush",
    image: 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Prataprao_Ganpatrao_Jadhav.jpg',
  },
  {
    name: 'Padmashree Vaidya Rajesh Kotecha',
    title: 'Secretary\nMinistry of Ayush',
    image: 'https://ui-avatars.com/api/?name=Rajesh+Kotecha&background=0D8ABC&color=fff&size=150',
  },
  {
    name: 'Prof. (Vd.) Pradeep Kumar Prajapati',
    title: 'Director\nAIIA, New Delhi',
    image: 'https://ui-avatars.com/api/?name=Pradeep+Kumar+Prajapati&background=1b2f5b&color=fff&size=150',
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Leadership Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-lg font-bold text-navy-900 mb-6 border-b pb-2">Leadership & Vision</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {officials.map((official, idx) => (
            <div key={idx} className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-50 mb-4 shadow-sm">
                <img 
                  src={official.image} 
                  alt={official.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${official.name.replace(/ /g, '+')}&background=random`;
                  }}
                />
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-1">{official.name}</h3>
              <p className="text-[11px] text-gray-500 whitespace-pre-line leading-relaxed">
                {official.title}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Page header */}
      <div className="pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Workspace Overview</h1>
        <p className="text-sm text-gray-500 mt-1">
          Monitor clinical trial operations across all AIIA sites in real-time.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <KPICard
            key={kpi.label}
            label={kpi.label}
            value={kpi.value}
            icon={kpiConfig[index].icon}
            trend={kpi.trend}
            trendDirection={kpi.trendDirection}
            accentColor={kpiConfig[index].color}
            accentBg={kpiConfig[index].bg}
            navigateTo={kpiConfig[index].navigateTo}
          />
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-96">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
             <h2 className="font-semibold text-gray-800">Recent Activity</h2>
          </div>
          <div className="p-4 flex-1 overflow-auto">
             <ActivityFeed />
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-96">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
             <h2 className="font-semibold text-gray-800">Upcoming Deadlines</h2>
          </div>
          <div className="p-4 flex-1 overflow-auto">
            <UpcomingDeadlines />
          </div>
        </div>
      </div>
    </div>
  );
}
