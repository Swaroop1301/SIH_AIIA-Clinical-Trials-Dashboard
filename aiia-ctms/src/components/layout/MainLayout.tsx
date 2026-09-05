import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function MainLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div
        className={`transition-all duration-300 ${
          sidebarCollapsed ? 'ml-[68px]' : 'ml-[248px]'
        }`}
      >
        <Topbar />
        <main className="app-content p-6 bg-gray-50/50 min-h-[calc(100vh-64px)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
