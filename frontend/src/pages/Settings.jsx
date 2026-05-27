import { useState, useEffect } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import { Card } from '../components/ui/Card';
import { useAuth } from '../hooks/useAuth';
import { User, Bell, Shield, Moon, Key } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

const Settings = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [newPassword, setNewPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  // Load saved preference
  useEffect(() => {
    const fetchPrefs = async () => {
      try {
        const { data } = await api.get('/auth/me');
        if (data.notificationsEnabled !== undefined) {
          setNotifications(data.notificationsEnabled);
        }
      } catch {}
    };
    fetchPrefs();
  }, []);

  const handleToggleNotifications = async (val) => {
    setNotifications(val);
    try {
      await api.put('/auth/preferences', { notificationsEnabled: val });
      toast.success(val ? 'Notifications enabled' : 'Notifications disabled');
    } catch {
      toast.error('Failed to save preference');
      setNotifications(!val); // revert
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) return toast.error('Password must be at least 6 characters');
    setIsChangingPassword(true);
    try {
      await api.put('/auth/update-password', { newPassword });
      toast.success('Password updated successfully!');
      setNewPassword('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <PageWrapper title="Account Settings">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        {/* Sidebar Nav */}
        <div className="md:col-span-1 space-y-2 stagger-1">
          <Card className="!p-3">
            {[
              { id: 'profile', icon: User, label: 'Profile Info' },
              { id: 'security', icon: Shield, label: 'Security' },
              { id: 'notifications', icon: Bell, label: 'Notifications' },
            ].map(({ id, icon: Icon, label }) => (
              <button key={id} onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all ${activeTab === id ? 'bg-accent/10 text-accent' : 'text-text-muted hover:text-text-primary hover:bg-surface-alt'}`}>
                <Icon className="w-5 h-5" /> {label}
              </button>
            ))}
          </Card>
        </div>

        {/* Main Form */}
        <div className="md:col-span-3 space-y-6 stagger-2">

          {activeTab === 'profile' && (
            <Card title="Profile Information">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Full Name</label>
                  <input disabled value={user?.fullname || '—'}
                    className="w-full px-4 py-2.5 bg-surface-alt/50 border border-white/5 rounded-xl text-text-muted cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Email Address</label>
                  <input disabled value={user?.email || '—'}
                    className="w-full px-4 py-2.5 bg-surface-alt/50 border border-white/5 rounded-xl text-text-muted cursor-not-allowed" />
                  <p className="text-xs text-text-muted mt-2">Contact an administrator to change your email.</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Role</label>
                  <input disabled value={user?.role?.toUpperCase() || '—'}
                    className="w-full px-4 py-2.5 bg-surface-alt/50 border border-white/5 rounded-xl text-text-muted cursor-not-allowed font-bold tracking-widest" />
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card title="Change Password">
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <p className="text-sm text-text-muted">Use a strong password of at least 6 characters.</p>
                <div>
                  <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">New Password</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input type="password" required minLength={6} value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-surface-alt border border-white/10 rounded-xl text-text-primary focus:outline-none focus:border-accent transition-all"
                      placeholder="Enter new password" />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button type="submit" disabled={isChangingPassword}
                    className="px-6 py-2.5 bg-accent hover:bg-accent/90 disabled:opacity-50 text-white font-semibold rounded-xl transition-all btn-glow">
                    {isChangingPassword ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card title="Notification Preferences">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-text-primary flex items-center gap-2">
                      <Bell className="w-4 h-4 text-accent" /> Email Notifications
                    </h4>
                    <p className="text-sm text-text-muted mt-0.5">Receive updates about grades, attendance, and announcements.</p>
                  </div>
                  <button onClick={() => handleToggleNotifications(!notifications)}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${notifications ? 'bg-accent shadow-[0_0_12px_rgba(124,111,255,0.5)]' : 'bg-surface-alt border border-white/10'}`}>
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${notifications ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>
                <div className="flex items-center justify-between opacity-60">
                  <div>
                    <h4 className="font-semibold text-text-primary flex items-center gap-2">
                      <Moon className="w-4 h-4 text-accent" /> Dark Mode
                    </h4>
                    <p className="text-sm text-text-muted mt-0.5">You can't escape the dark mode. It is eternal.</p>
                  </div>
                  <button disabled className="relative w-12 h-6 rounded-full bg-accent cursor-not-allowed">
                    <div className="absolute top-1 left-7 w-4 h-4 rounded-full bg-white" />
                  </button>
                </div>
              </div>
            </Card>
          )}

        </div>
      </div>
    </PageWrapper>
  );
};

export default Settings;
