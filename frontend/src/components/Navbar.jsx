import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Layout, LogOut, User, ShieldCheck, Menu } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50 px-6 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20 group-hover:shadow-blue-600/40 transition-shadow">
            <Layout size={18} />
          </div>
          <span className="text-xl font-extrabold text-slate-900 tracking-tight">Ethara</span>
        </Link>

        <div className="flex items-center gap-4">
          {!user ? (
            <>
              <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-3 py-2">
                Sign In
              </Link>
              <Link to="/signup" className="btn-primary text-sm">
                Get Started
              </Link>
            </>
          ) : (
            <>
              <Link 
                to={user.role === 'ROLE_ADMIN' ? '/admin-dashboard' : '/user-dashboard'} 
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-3 py-2"
              >
                Dashboard
              </Link>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-200">
                {user.role === 'ROLE_ADMIN' ? (
                  <ShieldCheck size={16} className="text-blue-600" />
                ) : (
                  <User size={16} className="text-slate-500" />
                )}
                <span className="text-xs font-semibold text-slate-700">{user.name}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  {user.role === 'ROLE_ADMIN' ? 'Admin' : 'Member'}
                </span>
              </div>
              <button 
                onClick={handleLogout} 
                className="flex items-center gap-1.5 text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
