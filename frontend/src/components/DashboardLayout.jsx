import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Layout, 
  Layers, 
  CheckSquare, 
  Users, 
  BarChart3, 
  LogOut, 
  Bell,
  Search
} from 'lucide-react';

const DashboardLayout = ({ children, role }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const adminLinks = [
    { name: 'Dashboard', path: '/admin-dashboard', icon: <BarChart3 size={18} /> },
    { name: 'Projects', path: '/admin-dashboard', icon: <Layers size={18} />, section: 'projects' },
    { name: 'Tasks', path: '/admin-dashboard', icon: <CheckSquare size={18} />, section: 'tasks' },
    { name: 'Team', path: '/admin-dashboard', icon: <Users size={18} />, section: 'team' },
  ];

  const userLinks = [
    { name: 'My Tasks', path: '/user-dashboard', icon: <CheckSquare size={18} /> },
  ];

  const links = role === 'ROLE_ADMIN' ? adminLinks : userLinks;

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-screen z-40">
        <div className="p-6 border-b border-slate-100 mb-2">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white shadow-md shadow-blue-600/20">
              <Layout size={18} />
            </div>
            <span className="text-lg font-extrabold text-slate-900 tracking-tight">Ethara</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1 py-2">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 mb-3">
            Navigation
          </div>
          {links.map((link, idx) => (
            <Link
              key={idx}
              to={link.path}
              className={`sidebar-link ${
                location.pathname === link.path && !link.section ? 'sidebar-link-active' : 'sidebar-link-inactive'
              }`}
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-3 py-3 mb-2">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="overflow-hidden">
              <div className="font-semibold text-slate-900 text-sm truncate">{user?.name}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {user?.role === 'ROLE_ADMIN' ? 'Admin' : 'Member'}
              </div>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors text-sm font-medium cursor-pointer"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 flex items-center justify-between px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search tasks, projects..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-slate-400 transition-all outline-none" 
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors relative cursor-pointer">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-6 w-px bg-slate-200"></div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <span className="text-sm font-semibold text-slate-700">{user?.name}</span>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl w-full mx-auto animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
