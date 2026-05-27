import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Lock, Mail, Sparkles } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(email, password);
      toast.success(`Welcome back, ${res.user.fullname}!`);
      setTimeout(() => {
        if (res.user.role === 'admin') navigate('/admin');
        else if (res.user.role === 'teacher') navigate('/teacher');
        else navigate('/student');
      }, 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <Toaster position="top-right" toastOptions={{ style: { background: '#0e0e1a', color: '#eeeef5', border: '1px solid rgba(255,255,255,0.08)' } }} />

      {/* Decorative orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/8 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10" style={{ animation: 'scaleIn 0.4s ease' }}>
        {/* Logo + Brand */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-5">
            <div className="relative">
              <img src="/logo.png" alt="SchoolDash Logo" className="w-16 h-16 object-contain float" />
              <div className="absolute inset-0 bg-accent/20 rounded-full blur-2xl" />
            </div>
          </div>
          <h1 className="text-3xl font-heading font-bold text-text-primary tracking-tight mb-1">
            School<span className="text-accent">Dash</span>
          </h1>
          <p className="text-text-muted text-sm">Sign in to your account to continue</p>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-muted uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-text-muted group-focus-within:text-accent transition-colors" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-surface-alt border border-white/8 rounded-xl text-text-primary text-sm transition-all placeholder:text-text-muted/50"
                  placeholder="you@school.edu"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-muted uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-text-muted group-focus-within:text-accent transition-colors" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-surface-alt border border-white/8 rounded-xl text-text-primary text-sm transition-all placeholder:text-text-muted/50"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => toast.success('Password reset link sent! (Demo mode)', { duration: 4000 })}
                className="text-xs text-text-muted hover:text-accent transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-accent hover:bg-accent/90 text-white font-semibold rounded-xl transition-all btn-glow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Authenticating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-xs text-text-muted">or</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          <p className="text-center text-sm text-text-muted">
            No account yet?{' '}
            <Link to="/register" className="text-accent hover:text-accent-light font-semibold transition-colors">
              Create one free
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-text-muted/50 mt-6">
          © 2026 SchoolDash · Built with Firebase + React
        </p>
      </div>
    </div>
  );
};

export default Login;
