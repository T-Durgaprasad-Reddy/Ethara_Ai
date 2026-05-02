import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import { CheckCircle, Clock, Users, ArrowRight, BarChart3, Shield, Zap, Globe, Layout } from 'lucide-react';

const PublicDashboard = () => {
  const [stats, setStats] = useState({ totalTasks: 0, tasksByStatus: {}, tasksPerUser: {}, overdueTasks: 0 });

  useEffect(() => {
    api.get('/dashboard/public').then(r => setStats(r.data)).catch(() => {});
  }, []);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-20">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-widest mb-8 border border-blue-100">
              <Zap size={14} /> Team Productivity Platform
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
              The smarter way to<br /><span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">manage teams.</span>
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
              Streamline your workflow with Ethara. Create projects, assign tasks, and track your team's progress — all in one beautiful platform.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/signup" className="btn-primary px-8 py-3.5 flex items-center gap-2 text-sm shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 transition-shadow">
                Get Started Free <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="btn-secondary px-8 py-3.5 text-sm">Sign In</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Everything your team needs</h2>
          <p className="text-slate-500 font-medium">Built with Spring Boot, React, and MySQL for enterprise reliability.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Feature icon={<Shield className="text-blue-600" />} title="Role-Based Access" desc="Admins manage everything. Members focus on their assigned tasks. Clean separation of concerns." />
          <Feature icon={<Zap className="text-amber-500" />} title="Real-Time Dashboard" desc="Track task counts, completion rates, overdue items, and team performance at a glance." />
          <Feature icon={<Globe className="text-emerald-500" />} title="Project Collaboration" desc="Create projects, add team members, assign tasks with priorities and due dates." />
        </div>
      </div>

      {/* Live Stats */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat label="Total Tasks" value={stats.totalTasks} icon={<BarChart3 size={22} />} />
          <Stat label="Completed" value={stats.tasksByStatus['DONE'] || 0} icon={<CheckCircle size={22} />} />
          <Stat label="Active Users" value={Object.keys(stats.tasksPerUser).length} icon={<Users size={22} />} />
          <Stat label="In Progress" value={stats.tasksByStatus['IN_PROGRESS'] || 0} icon={<Clock size={22} />} />
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-16 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="relative">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to boost your team's productivity?</h2>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto font-medium">Create your free account and start managing projects in minutes.</p>
            <Link to="/signup" className="inline-flex items-center gap-2 px-10 py-4 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-100 transition-colors shadow-lg text-sm">
              Start Free <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>

      <footer className="border-t border-slate-100 py-10 text-center text-slate-400 text-sm font-medium">
        &copy; 2026 Ethara AI — Team Task Management Platform. Built with React + Spring Boot + MySQL.
      </footer>
    </div>
  );
};

const Feature = ({ icon, title, desc }) => (
  <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-lg hover:shadow-slate-200/50 transition-all group">
    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-slate-200 mb-5 group-hover:shadow-md transition-shadow">{icon}</div>
    <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
    <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
  </div>
);

const Stat = ({ label, value, icon }) => (
  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-lg hover:shadow-slate-200/50 transition-all group">
    <div className="flex items-center justify-between mb-3">
      <div className="text-slate-300 group-hover:text-blue-500 transition-colors">{icon}</div>
      <div className="text-3xl font-black text-slate-900 tracking-tighter">{value}</div>
    </div>
    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</div>
  </div>
);

export default PublicDashboard;
