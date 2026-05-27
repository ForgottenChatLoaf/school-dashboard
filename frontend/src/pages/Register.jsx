import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Shield, Sparkles } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import api from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({ fullname: '', email: '', password: '', role: 'student' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/register', formData);
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { value: 'student', label: 'Student', desc: 'View grades & attendance' },
    { value: 'teacher', label: 'Teacher', desc: 'Manage classes & gradebook' },
    { value: 'admin', label: 'Administrator', desc: 'Full system access' },
  ];

  return (
    <div className="auth-bg min-h-screen flex items-center justify-center p-4 py-12 relative overflow-hidden">
      <Toaster position="top-right" toastOptions={{ style: { background: '#0e0e1a', color: '#eeeef5', border: '1px solid rgba(255,255,255,0.08)' } }} />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-accent/8 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10" style={{ animation: 'scaleIn 0.4s ease' }}>
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-5">
            <div className="relative">
              <img src="/logo.png" alt="SchoolDash Logo" className="w-16 h-16 object-contain float" />
              <div className="absolute inset-0 bg-accent/20 rounded-full blur-2xl" />
            </div>
          </div>
          <h1 className="text-3xl font-heading font-bold text-text-primary tracking-tight mb-1">Create Account</h1>
          <p className="text-text-muted text-sm">Join SchoolDash and get started</p>
        </div>

        <div className="glass rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              { label: 'Full Name', type: 'text', key: 'fullname', icon: User, placeholder: 'Juan dela Cruz' },
              { label: 'Email Address', type: 'email', key: 'email', icon: Mail, placeholder: 'juan@school.edu' },
              { label: 'Password', type: 'password', key: 'password', icon: Lock, placeholder: '••••••••' },
            ].map(({ label, type, key, icon: Icon, placeholder }) => (
              <div key={key} className="space-y-1.5">
                <label className="text-xs font-semibold text-text-muted uppercase tracking-widest ml-1">{label}</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Icon className="h-4 w-4 text-text-muted group-focus-within:text-accent transition-colors" />
                  </div>
                  <input required type={type} value={formData[key]} onChange={e => setFormData({ ...formData, [key]: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-surface-alt border border-white/8 rounded-xl text-text-primary text-sm transition-all placeholder:text-text-muted/50"
                    placeholder={placeholder} />
                </div>
              </div>
            ))}

            <div className="space-y-2">
              <label className="text-xs font-semibold text-text-muted uppercase tracking-widest ml-1">I am a...</label>
              <div className="grid grid-cols-3 gap-2">
                {roles.map(role => (
                  <button key={role.value} type="button" onClick={() => setFormData({ ...formData, role: role.value })}
                    className={`flex flex-col items-center p-3 rounded-xl border text-center transition-all ${
                      formData.role === role.value
                        ? 'bg-accent/10 border-accent/50 text-accent shadow-[0_0_15px_rgba(124,111,255,0.15)]'
                        : 'bg-surface-alt border-white/8 text-text-muted hover:border-white/20'
                    }`}>
                    <Shield className={`w-4 h-4 mb-1 ${formData.role === role.value ? 'text-accent' : ''}`} />
                    <span className="text-xs font-bold">{role.label}</span>
                    <span className="text-[10px] opacity-60 leading-tight mt-0.5">{role.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 px-4 bg-accent hover:bg-accent/90 text-white font-semibold rounded-xl transition-all btn-glow disabled:opacity-50 flex items-center justify-center gap-2 text-sm mt-2">
              {loading ? (
                <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Creating Account...</>
              ) : (
                <><Sparkles className="w-4 h-4" />Create Account</>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-text-muted mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-accent hover:text-accent-light font-semibold transition-colors">Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
