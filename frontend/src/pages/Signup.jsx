import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';
import { Mail, Lock, User, AlertCircle, Layout, ShieldCheck, UserCircle, ArrowRight, CheckCircle } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'USER'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/signup', formData);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 px-6 py-12">
      <div className="mb-8 flex items-center gap-2.5">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
          <Layout size={22} />
        </div>
        <span className="text-2xl font-extrabold text-slate-900 tracking-tight">Ethara</span>
      </div>

      <div className="bg-white w-full max-w-md p-10 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 animate-scale-in">
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Create Account</h2>
        <p className="text-sm text-slate-500 mb-8 font-medium">Join Ethara and start managing your team.</p>
        
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl mb-6 flex items-start gap-3 text-sm font-medium">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 p-4 rounded-xl mb-6 font-medium text-sm flex items-center gap-3">
            <CheckCircle size={18} />
            Account created! Redirecting to login...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                id="signup-name"
                type="text"
                className="input-field pl-12"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                minLength={3}
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                id="signup-email"
                type="email"
                className="input-field pl-12"
                placeholder="john@company.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                id="signup-password"
                type="password"
                className="input-field pl-12"
                placeholder="Minimum 6 characters"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
                minLength={6}
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">Account Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({...formData, role: 'USER'})}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  formData.role === 'USER' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <UserCircle size={20} />
                <div className="text-left">
                  <div className="text-sm font-bold">Member</div>
                  <div className="text-[10px] opacity-70">View & update tasks</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, role: 'ADMIN'})}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  formData.role === 'ADMIN' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <ShieldCheck size={20} />
                <div className="text-left">
                  <div className="text-sm font-bold">Admin</div>
                  <div className="text-[10px] opacity-70">Full project control</div>
                </div>
              </button>
            </div>
          </div>

          <button
            id="signup-submit"
            type="submit"
            disabled={loading || success}
            className="w-full btn-primary py-3.5 text-sm font-bold tracking-tight disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Creating Account...
              </>
            ) : (
              <>Create Account <ArrowRight size={16} /></>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-500 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-bold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
