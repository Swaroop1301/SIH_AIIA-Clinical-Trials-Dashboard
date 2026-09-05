import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, MapPin, ChevronRight } from 'lucide-react';
import { sites } from '@/data/mockData';

export default function Sites() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const filteredSites = sites.filter((site) => {
    const matchesSearch =
      site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.pi.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || site.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Site Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage research sites and monitor performance
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-navy-900 text-white text-sm font-medium rounded-lg hover:bg-navy-800 transition-colors">
          <Plus className="w-4 h-4" />
          Add Site
        </button>
      </div>

      {/* Search */}
      <div
        className="bg-white rounded-xl p-4 flex items-center gap-3"
        style={{ boxShadow: 'var(--shadow-card)' }}
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by site name, city, or PI..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500 transition-all"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-9 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500"
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      {/* Site Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredSites.map((site) => (
          <Link
            key={site.id}
            to={`/app/sites/${site.id}`}
            className="bg-white rounded-xl p-5 transition-all duration-200 hover:shadow-md group block"
            style={{ boxShadow: 'var(--shadow-card)' }}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-base font-semibold text-gray-900 group-hover:text-navy-900 transition-colors">
                  {site.name}
                </h3>
                <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                  <MapPin className="w-3.5 h-3.5" />
                  {site.city}, {site.state}
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-navy-900 transition-colors shrink-0" />
            </div>

            <p className="text-xs text-gray-400 mb-4">PI: {site.pi}</p>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-lg p-2.5 text-center">
                <p className="text-lg font-bold text-gray-900">{site.activeTrials}</p>
                <p className="text-[11px] text-gray-500">Active Trials</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2.5 text-center">
                <p className="text-lg font-bold text-gray-900">{site.totalParticipants}</p>
                <p className="text-[11px] text-gray-500">Participants</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2.5 text-center">
                <p className="text-lg font-bold text-gray-900">{site.enrollmentRate}%</p>
                <p className="text-[11px] text-gray-500">Enrollment Rate</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2.5 text-center">
                <p className={`text-lg font-bold ${site.complianceScore >= 90 ? 'text-emerald-600' : site.complianceScore >= 80 ? 'text-amber-600' : 'text-crimson-600'}`}>
                  {site.complianceScore}%
                </p>
                <p className="text-[11px] text-gray-500">Compliance</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
