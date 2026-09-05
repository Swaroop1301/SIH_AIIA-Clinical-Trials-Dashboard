import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FlaskConical,
  Building2,
  Users,
  Calendar,
  AlertTriangle,
  ShieldCheck,
  FileText,
  ClipboardList,
  BarChart3,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const navItems = [
  { to: '/app', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/app/trials', icon: FlaskConical, label: 'Trials' },
  { to: '/app/sites', icon: Building2, label: 'Sites' },
  { to: '/app/participants', icon: Users, label: 'Participants' },
  { to: '/app/visits', icon: Calendar, label: 'Visits' },
  { to: '/app/adverse-events', icon: AlertTriangle, label: 'Adverse Events' },
  { to: '/app/ethics', icon: ShieldCheck, label: 'Ethics & Compliance' },
  { to: '/app/documents', icon: FileText, label: 'Documents' },
  { to: '/app/audit', icon: ClipboardList, label: 'Audit Trail' },
  { to: '/app/reports', icon: BarChart3, label: 'Reports' },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-navy-900 text-white z-40 transition-all duration-300 ease-in-out flex flex-col ${
        collapsed ? 'w-[68px]' : 'w-[248px]'
      }`}
      style={{ boxShadow: 'var(--shadow-sidebar)' }}
    >
      {/* Logo / Brand */}
      <div className="flex items-center h-16 px-4 border-b border-white/10">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-white">A</span>
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <h1 className="text-sm font-bold tracking-wide text-white truncate">
                AIIA CTMS
              </h1>
              <p className="text-[10px] text-white/50 truncate">
                Clinical Trial Management
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-2 overflow-y-auto scrollbar-thin">
        <ul className="space-y-0.5">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === '/app'}
                onMouseEnter={() => setHoveredItem(item.to)}
                onMouseLeave={() => setHoveredItem(null)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative group ${
                    isActive
                      ? 'bg-white/15 text-white'
                      : 'text-white/65 hover:text-white hover:bg-white/8'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-white rounded-r-full" />
                    )}
                    <item.icon className="w-[18px] h-[18px] shrink-0" strokeWidth={1.8} />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                    {collapsed && hoveredItem === item.to && (
                      <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-gray-900 text-white text-xs rounded-md whitespace-nowrap shadow-lg z-50">
                        {item.label}
                      </div>
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Collapse toggle */}
      <div className="p-2 border-t border-white/10">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-white/50 hover:text-white hover:bg-white/8 transition-colors text-sm"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
