import React, { useState, useEffect } from 'react';
import api from '../api/api';
import DashboardLayout from '../components/DashboardLayout';
import { Plus, Trash2, Layers, Clock, User as UserIcon, Calendar, AlertCircle, X, UserPlus, UserMinus } from 'lucide-react';

const AdminDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectName, setProjectName] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [taskData, setTaskData] = useState({
    title: '', description: '', dueDate: '', priority: 'MEDIUM', status: 'TODO', projectId: '', assignedToId: ''
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [projRes, taskRes, userRes] = await Promise.all([
        api.get('/projects'), api.get('/tasks'), api.get('/users')
      ]);
      setProjects(projRes.data);
      setTasks(taskRes.data);
      setUsers(userRes.data);
    } catch (err) { console.error("Error fetching data", err); }
    finally { setLoading(false); }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', { name: projectName, description: projectDesc });
      setProjectName(''); setProjectDesc(''); setShowProjectModal(false); fetchData();
    } catch (err) { alert("Failed to create project"); }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', taskData);
      setTaskData({ title: '', description: '', dueDate: '', priority: 'MEDIUM', status: 'TODO', projectId: '', assignedToId: '' });
      setShowTaskModal(false); fetchData();
    } catch (err) { alert("Failed to create task"); }
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm("Delete this task?")) {
      try { await api.delete(`/tasks/${id}`); fetchData(); }
      catch (err) { alert("Delete failed"); }
    }
  };

  const handleAddMember = async (userId) => {
    try {
      await api.post(`/projects/${selectedProject.id}/members`, { userId });
      const res = await api.get(`/projects/${selectedProject.id}`);
      setSelectedProject(res.data); fetchData();
    } catch (err) { alert(err.response?.data?.message || "Failed to add member"); }
  };

  const handleRemoveMember = async (userId) => {
    try {
      await api.delete(`/projects/${selectedProject.id}/members/${userId}`);
      const res = await api.get(`/projects/${selectedProject.id}`);
      setSelectedProject(res.data); fetchData();
    } catch (err) { alert(err.response?.data?.message || "Failed to remove member"); }
  };

  const donePct = tasks.length ? Math.round((tasks.filter(t => t.status === 'DONE').length / tasks.length) * 100) : 0;
  const overdue = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'DONE').length;

  return (
    <DashboardLayout role="ROLE_ADMIN">
      <div className="space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Project Overview</h1>
            <p className="text-sm text-slate-500 mt-1">Manage your team's progress and assignments.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowProjectModal(true)} className="btn-secondary cursor-pointer">New Project</button>
            <button onClick={() => setShowTaskModal(true)} className="btn-primary flex items-center gap-2 cursor-pointer">
              <Plus size={18} /> New Task
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatItem label="Projects" value={projects.length} icon={<Layers className="text-blue-600" />} bg="bg-blue-50" />
          <StatItem label="Active Tasks" value={tasks.filter(t => t.status !== 'DONE').length} icon={<Clock className="text-amber-500" />} bg="bg-amber-50" />
          <StatItem label="Team Size" value={users.length} icon={<UserIcon className="text-indigo-600" />} bg="bg-indigo-50" />
          <StatItem label="Overdue" value={overdue} icon={<AlertCircle className="text-red-500" />} bg="bg-red-50" />
        </div>

        {/* Projects Row */}
        {projects.length > 0 && (
          <div>
            <h2 className="font-bold text-slate-900 mb-4">Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map(p => (
                <div key={p.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-slate-900">{p.name}</h3>
                    <button onClick={() => { setSelectedProject(p); setShowMemberModal(true); }}
                      className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 cursor-pointer">
                      <UserPlus size={14} /> Members
                    </button>
                  </div>
                  {p.description && <p className="text-xs text-slate-500 mb-3">{p.description}</p>}
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    <span>{tasks.filter(t => t.project?.id === p.id).length} tasks</span>
                    <span>·</span>
                    <span>{p.members?.length || 0} members</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Task Table */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="font-bold text-slate-900">All Tasks</h2>
            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">{tasks.length} total</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="px-6 py-4">Task</th><th className="px-6 py-4">Project</th>
                  <th className="px-6 py-4">Assignee</th><th className="px-6 py-4">Due Date</th>
                  <th className="px-6 py-4">Priority</th><th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr><td colSpan="7" className="px-6 py-16 text-center text-slate-400">Loading...</td></tr>
                ) : tasks.length === 0 ? (
                  <tr><td colSpan="7" className="px-6 py-16 text-center text-slate-400">No tasks yet. Create one to get started.</td></tr>
                ) : tasks.map(task => (
                  <tr key={task.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4"><div className="font-semibold text-slate-900 text-sm">{task.title}</div></td>
                    <td className="px-6 py-4 text-sm text-slate-600">{task.project?.name}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                          {task.assignedTo?.name?.charAt(0)}
                        </div>
                        <span className="text-sm text-slate-700">{task.assignedTo?.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <Calendar size={13} />{task.dueDate}
                      </div>
                    </td>
                    <td className="px-6 py-4"><PriorityBadge priority={task.priority} /></td>
                    <td className="px-6 py-4"><StatusPill status={task.status} /></td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleDeleteTask(task.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Project Modal */}
        {showProjectModal && (
          <Modal title="Create New Project" onClose={() => setShowProjectModal(false)}>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Project Name</label>
                <input className="input-field" value={projectName} onChange={e => setProjectName(e.target.value)} placeholder="e.g. Q2 Marketing" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Description (optional)</label>
                <input className="input-field" value={projectDesc} onChange={e => setProjectDesc(e.target.value)} placeholder="Brief project description" />
              </div>
              <button type="submit" className="w-full btn-primary mt-2 cursor-pointer">Create Project</button>
            </form>
          </Modal>
        )}

        {/* Create Task Modal */}
        {showTaskModal && (
          <Modal title="Assign New Task" onClose={() => setShowTaskModal(false)}>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Title</label>
                <input className="input-field" value={taskData.title} onChange={e => setTaskData({...taskData, title: e.target.value})} placeholder="Task title" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Description</label>
                <input className="input-field" value={taskData.description} onChange={e => setTaskData({...taskData, description: e.target.value})} placeholder="Brief description" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Project</label>
                  <select className="input-field" value={taskData.projectId} onChange={e => setTaskData({...taskData, projectId: e.target.value})} required>
                    <option value="">Select</option>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Assign To</label>
                  <select className="input-field" value={taskData.assignedToId} onChange={e => setTaskData({...taskData, assignedToId: e.target.value})} required>
                    <option value="">Select</option>
                    {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Due Date</label>
                  <input type="date" className="input-field" value={taskData.dueDate} onChange={e => setTaskData({...taskData, dueDate: e.target.value})} required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Priority</label>
                  <select className="input-field" value={taskData.priority} onChange={e => setTaskData({...taskData, priority: e.target.value})}>
                    <option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full btn-primary mt-2 cursor-pointer">Create Task</button>
            </form>
          </Modal>
        )}

        {/* Member Management Modal */}
        {showMemberModal && selectedProject && (
          <Modal title={`Members — ${selectedProject.name}`} onClose={() => setShowMemberModal(false)}>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Current Members</label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {(selectedProject.members || []).map(m => (
                    <div key={m.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold">{m.name?.charAt(0)}</div>
                        <div><div className="text-sm font-semibold text-slate-800">{m.name}</div><div className="text-[10px] text-slate-400">{m.email}</div></div>
                      </div>
                      {m.id !== selectedProject.admin?.id && (
                        <button onClick={() => handleRemoveMember(m.id)} className="text-red-400 hover:text-red-600 p-1 cursor-pointer"><UserMinus size={16} /></button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Add Member</label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {users.filter(u => !(selectedProject.members || []).find(m => m.id === u.id)).map(u => (
                    <div key={u.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-slate-300 rounded-full flex items-center justify-center text-white text-xs font-bold">{u.name?.charAt(0)}</div>
                        <div><div className="text-sm font-semibold text-slate-800">{u.name}</div><div className="text-[10px] text-slate-400">{u.email}</div></div>
                      </div>
                      <button onClick={() => handleAddMember(u.id)} className="text-blue-500 hover:text-blue-700 p-1 cursor-pointer"><UserPlus size={16} /></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </DashboardLayout>
  );
};

const StatItem = ({ label, value, icon, bg }) => (
  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
    <div className={`p-3 ${bg} rounded-xl`}>{icon}</div>
    <div>
      <div className="text-2xl font-bold text-slate-900">{value}</div>
      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</div>
    </div>
  </div>
);

const StatusPill = ({ status }) => {
  const s = { TODO: 'bg-slate-100 text-slate-600', IN_PROGRESS: 'bg-blue-50 text-blue-600', DONE: 'bg-emerald-50 text-emerald-600' };
  return <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${s[status]}`}>{(status||'').replace('_',' ')}</span>;
};

const PriorityBadge = ({ priority }) => {
  const s = { LOW: 'text-blue-500', MEDIUM: 'text-amber-500', HIGH: 'text-red-500' };
  return <span className={`text-[10px] font-black uppercase tracking-wider ${s[priority]}`}>{priority}</span>;
};

const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] px-4" onClick={onClose}>
    <div className="bg-white p-8 rounded-2xl w-full max-w-lg border border-slate-200 shadow-xl animate-scale-in" onClick={e => e.stopPropagation()}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"><X size={20} /></button>
      </div>
      {children}
    </div>
  </div>
);

export default AdminDashboard;
