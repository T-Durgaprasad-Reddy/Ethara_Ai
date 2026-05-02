import React, { useState, useEffect } from 'react';
import api from '../api/api';
import DashboardLayout from '../components/DashboardLayout';
import { CheckCircle, Clock, Calendar, Play, Check } from 'lucide-react';

const UserDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try { 
      const [taskRes, projRes] = await Promise.all([
        api.get('/tasks'),
        api.get('/projects')
      ]);
      setTasks(taskRes.data); 
      setProjects(projRes.data);
    }
    catch (err) { console.error("Error fetching data", err); }
    finally { setLoading(false); }
  };

  const updateStatus = async (task, newStatus) => {
    try {
      await api.put(`/tasks/${task.id}`, { ...task, status: newStatus, projectId: task.project.id, assignedToId: task.assignedTo.id });
      fetchData();
    } catch (err) { alert("Status update failed"); }
  };

  const todo = tasks.filter(t => t.status === 'TODO');
  const inProgress = tasks.filter(t => t.status === 'IN_PROGRESS');
  const done = tasks.filter(t => t.status === 'DONE');

  return (
    <DashboardLayout role="ROLE_USER">
      <div className="space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Workspace</h1>
            <p className="text-sm text-slate-500 mt-1">Track and manage your assigned tasks.</p>
          </div>
          <div className="flex gap-3">
            <Chip label="Active" value={tasks.filter(t => t.status !== 'DONE').length} color="blue" />
            <Chip label="Done" value={done.length} color="emerald" />
          </div>
        </div>

        {/* Projects Row */}
        {!loading && projects.length > 0 && (
          <div className="mb-6">
            <h2 className="font-bold text-slate-900 mb-4 text-lg">My Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map(p => (
                <div key={p.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-slate-900">{p.name}</h3>
                  </div>
                  {p.description && <p className="text-xs text-slate-500 mb-3">{p.description}</p>}
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    <span>{tasks.filter(t => t.project?.id === p.id).length} assigned tasks</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center p-20">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="bg-white p-20 text-center rounded-2xl border border-dashed border-slate-200">
            <CheckCircle size={48} className="mx-auto mb-4 text-slate-200" />
            <h3 className="text-xl font-bold text-slate-400">No tasks assigned</h3>
            <p className="text-slate-400 text-sm mt-1">Ask your admin for new assignments.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <Column title="To Do" count={todo.length} dot="bg-slate-400">
              {todo.map(t => <TaskCard key={t.id} task={t} action={
                <button onClick={() => updateStatus(t, 'IN_PROGRESS')} className="w-full mt-4 py-2 text-blue-600 border border-blue-200 bg-blue-50/50 rounded-lg hover:bg-blue-600 hover:text-white transition-all text-xs font-bold flex items-center justify-center gap-2 cursor-pointer">
                  <Play size={14} /> Start
                </button>
              } />)}
            </Column>
            <Column title="In Progress" count={inProgress.length} dot="bg-blue-500">
              {inProgress.map(t => <TaskCard key={t.id} task={t} action={
                <button onClick={() => updateStatus(t, 'DONE')} className="w-full mt-4 py-2 text-emerald-600 border border-emerald-200 bg-emerald-50/50 rounded-lg hover:bg-emerald-600 hover:text-white transition-all text-xs font-bold flex items-center justify-center gap-2 cursor-pointer">
                  <Check size={14} /> Complete
                </button>
              } />)}
            </Column>
            <Column title="Done" count={done.length} dot="bg-emerald-500">
              {done.map(t => <TaskCard key={t.id} task={t} isDone action={
                <div className="mt-4 py-2 bg-emerald-50 rounded-lg text-emerald-600 text-[10px] font-bold flex items-center justify-center gap-2 border border-emerald-100 uppercase tracking-widest">
                  <CheckCircle size={14} /> Completed
                </div>
              } />)}
            </Column>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

const Chip = ({ label, value, color }) => (
  <div className={`bg-${color}-50 px-4 py-2 rounded-lg border border-${color}-100 flex items-center gap-3`}>
    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
    <span className={`text-lg font-bold text-${color}-600`}>{value}</span>
  </div>
);

const Column = ({ title, count, dot, children }) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between px-1">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${dot}`}></div>
        <h3 className="font-bold text-slate-900 text-sm">{title}</h3>
      </div>
      <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{count}</span>
    </div>
    <div className="space-y-3 min-h-[100px]">{children}</div>
  </div>
);

const TaskCard = ({ task, action, isDone }) => {
  const pc = { LOW: 'text-blue-500', MEDIUM: 'text-amber-500', HIGH: 'text-red-500' };
  return (
    <div className={`bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all ${isDone ? 'opacity-60' : ''}`}>
      <div className="flex justify-between items-start mb-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{task.project?.name}</span>
        <span className={`text-[9px] font-black uppercase tracking-widest ${pc[task.priority]}`}>{task.priority}</span>
      </div>
      <h4 className="font-bold text-slate-900 leading-snug text-sm">{task.title}</h4>
      {task.description && <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">{task.description}</p>}
      <div className="mt-3 flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
        <Calendar size={12} />{task.dueDate}
      </div>
      {action}
    </div>
  );
};

export default UserDashboard;
