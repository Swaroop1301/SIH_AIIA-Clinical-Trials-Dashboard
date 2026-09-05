import { useState, useRef, useEffect } from 'react';
import { Bell, Search, User, ChevronRight, LogOut, Settings, ChevronDown, X } from 'lucide-react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { trials, sites } from '@/data/mockData';

const breadcrumbMap: Record<string, string> = {
  '/app': 'Dashboard',
  '/app/trials': 'Trials',
  '/app/sites': 'Sites',
  '/app/participants': 'Participants',
  '/app/visits': 'Visits',
  '/app/adverse-events': 'Adverse Events',
  '/app/ethics': 'Ethics & Compliance',
  '/app/documents': 'Documents',
  '/app/audit': 'Audit Trail',
  '/app/reports': 'Reports',
};

const notifications = [
  { id: 1, text: 'IEC Renewal due in 10 days for Ashwagandha Trial', time: '2 hours ago', read: false },
  { id: 2, text: 'New adverse event reported in Triphala Trial', time: '4 hours ago', read: false },
  { id: 3, text: 'Ethics approval granted for Yoga HTN Trial', time: '1 day ago', read: true },
  { id: 4, text: 'Protocol v2.3 uploaded for Panchakarma Trial', time: '1 day ago', read: true },
  { id: 5, text: 'SDM Udupi site activated for Turmeric Trial', time: '2 days ago', read: true },
];

export default function Topbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [readNotifs, setReadNotifs] = useState<Set<number>>(new Set());

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const getBreadcrumbs = () => {
    const crumbs = [{ label: 'Dashboard', path: '/app' }];
    if (location.pathname !== '/app') {
      const basePath = '/app/' + (pathSegments[1] || '');
      crumbs.push({
        label: breadcrumbMap[basePath] || pathSegments[1],
        path: basePath,
      });
      if (pathSegments.length > 2) {
        crumbs.push({
          label: pathSegments[2],
          path: location.pathname,
        });
      }
    }
    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  // Search results
  const searchResults = searchQuery.length >= 2 ? [
    ...trials
      .filter(t =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.pi.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 3)
      .map(t => ({ type: 'Trial' as const, id: t.id, label: t.title, path: `/app/trials/${t.id}` })),
    ...sites
      .filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.pi.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 3)
      .map(s => ({ type: 'Site' as const, id: s.id, label: s.name, path: `/app/sites/${s.id}` })),
  ] : [];

  const unreadCount = notifications.filter(n => !n.read && !readNotifs.has(n.id)).length;

  const markAllRead = () => {
    setReadNotifs(new Set(notifications.map(n => n.id)));
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200/80">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <span key={crumb.path + index} className="flex items-center gap-1.5">
              {index > 0 && (
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              )}
              {index < breadcrumbs.length - 1 ? (
                <Link
                  to={crumb.path}
                  className="text-gray-400 hover:text-navy-900 transition-colors"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-navy-900 font-semibold">
                  {crumb.label}
                </span>
              )}
            </span>
          ))}
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative hidden md:block" ref={searchRef}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
            <input
              type="text"
              placeholder="Search trials, sites, participants..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true); }}
              onFocus={() => setSearchOpen(true)}
              className="w-72 h-9 pl-9 pr-8 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(''); setSearchOpen(false); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            {/* Search dropdown */}
            {searchOpen && searchQuery.length >= 2 && (
              <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50">
                {searchResults.length > 0 ? (
                  <div className="py-1">
                    {searchResults.map((result) => (
                      <button
                        key={result.id}
                        onClick={() => {
                          navigate(result.path);
                          setSearchQuery('');
                          setSearchOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 text-left transition-colors"
                      >
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-navy-50 text-navy-700 uppercase shrink-0">
                          {result.type}
                        </span>
                        <span className="text-sm text-gray-700 truncate">{result.label}</span>
                        <span className="text-xs text-gray-400 ml-auto shrink-0">{result.id}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm text-gray-400">
                    No results found for "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => { setNotifOpen(!notifOpen); setUserOpen(false); }}
              className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Bell className="w-[18px] h-[18px] text-gray-500" strokeWidth={1.8} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-crimson-600 rounded-full flex items-center justify-center">
                  <span className="text-[9px] font-bold text-white">{unreadCount}</span>
                </span>
              )}
            </button>
            {/* Notification dropdown */}
            {notifOpen && (
              <div className="absolute right-0 top-full mt-1 w-80 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <span className="text-sm font-semibold text-gray-900">Notifications</span>
                  <button
                    onClick={markAllRead}
                    className="text-xs text-navy-900 hover:underline font-medium"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notif) => {
                    const isRead = notif.read || readNotifs.has(notif.id);
                    return (
                      <div
                        key={notif.id}
                        className={`px-4 py-3 border-b border-gray-50 last:border-0 cursor-pointer hover:bg-gray-50 transition-colors ${
                          !isRead ? 'bg-navy-50/30' : ''
                        }`}
                        onClick={() => setReadNotifs(prev => new Set([...prev, notif.id]))}
                      >
                        <div className="flex items-start gap-2">
                          {!isRead && <div className="w-2 h-2 rounded-full bg-navy-900 mt-1.5 shrink-0" />}
                          <div className={!isRead ? '' : 'pl-4'}>
                            <p className="text-sm text-gray-700">{notif.text}</p>
                            <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Separator */}
          <div className="w-px h-8 bg-gray-200" />

          {/* User Dropdown */}
          <div className="relative" ref={userRef}>
            <button
              onClick={() => { setUserOpen(!userOpen); setNotifOpen(false); }}
              className="flex items-center gap-2.5 hover:bg-gray-50 rounded-lg px-2 py-1.5 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-navy-900 flex items-center justify-center">
                <User className="w-4 h-4 text-white" strokeWidth={1.8} />
              </div>
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900 leading-tight">
                  Swaroop
                </p>
                <p className="text-[11px] text-gray-400 leading-tight">
                  Admin
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden sm:block" />
            </button>
            {/* User dropdown */}
            {userOpen && (
              <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">Swaroop</p>
                  <p className="text-xs text-gray-400">swaroop@aiia.gov.in</p>
                  <p className="text-xs text-navy-700 font-medium mt-1">Role: Admin</p>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => { navigate('/'); setUserOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <User className="w-4 h-4 text-gray-400" />
                    My Profile
                  </button>
                  <button
                    onClick={() => { setUserOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-gray-400" />
                    Settings
                  </button>
                </div>
                <div className="border-t border-gray-100 py-1">
                  <button
                    onClick={() => { setUserOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-crimson-600 hover:bg-crimson-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
