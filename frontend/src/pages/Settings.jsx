import { useState } from 'react';
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
            <button onClick={() => setActiveTab('profile')} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all ${activeTab === 'profile' ? 'bg-accent/10 text-accent' : 'text-text-muted hover:text-text-primary hover:bg-surface-alt'}`}>
              <User className="w-5 h-5" /> Profile Info
            </button>
            <button onClick={() => setActiveTab('security')} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all ${activeTab === 'security' ? 'bg-accent/10 text-accent' : 'text-text-muted hover:text-text-primary hover:bg-surface-alt'}`}>
              <Shield className="w-5 h-5" /> Security
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-alt transition-all">
              <Bell className="w-5 h-5" /> Notifications
            </button>
          </Card>
        </div>

        {/* Main Settings Form */}
        <div className="md:col-span-3 space-y-6 stagger-2">
          
          {activeTab === 'profile' && (
            <>
              <Card title="Profile Information">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Full Name</label>
                    <input type="text" disabled value={user?.fullname || 'Loading...'} 
                      className="w-full px-4 py-2.5 bg-surface-alt/50 border border-white/5 rounded-xl text-text-muted cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Email Address</label>
                    <input type="email" disabled value={user?.email || 'Loading...'} 
                      className="w-full px-4 py-2.5 bg-surface-alt/50 border border-white/5 rounded-xl text-text-muted cursor-not-allowed" />
                    <p className="text-xs text-text-muted mt-2">Contact an administrator to change your email.</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Role</label>
                    <input type="text" disabled value={user?.role?.toUpperCase() || 'USER'} 
                      className="w-full px-4 py-2.5 bg-surface-alt/50 border border-white/5 rounded-xl text-text-muted cursor-not-allowed font-bold" />
                  </div>
                </div>
              </Card>

              <Card title="System Preferences">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-text-primary flex items-center gap-2"><Bell className="w-4 h-4 text-accent" /> Email Notifications</h4>
                      <p className="text-sm text-text-muted">Receive updates about system announcements.</p>
                    </div>
                    <button onClick={() => setNotifications(!notifications)} className={`relative w-12 h-6 rounded-full transition-colors ${notifications ? 'bg-accent' : 'bg-surface-alt border border-white/10'}`}>
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${notifications ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-text-primary flex items-center gap-2"><Moon className="w-4 h-4 text-accent" /> Dark Mode</h4>
                      <p className="text-sm text-text-muted">You can't escape the dark mode. It is eternal.</p>
                    </div>
                    <button disabled className="relative w-12 h-6 rounded-full bg-accent cursor-not-allowed opacity-80">
                      <div className="absolute top-1 left-7 w-4 h-4 rounded-full bg-white" />
                    </button>
                  </div>
                </div>
              </Card>
            </>
          )}

          {activeTab === 'security' && (
            <Card title="Change Password">
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <p className="text-sm text-text-muted mb-4">Ensure your account is using a long, random password to stay secure.</p>
                <div>
                  <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">New Password</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input type="password" required minLength={6} value={newPassword} onChange={e => setNewPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-surface-alt border border-white/10 rounded-xl text-text-primary focus:outline-none focus:border-accent transition-all" 
                      placeholder="Enter new password" />
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <button type="submit" disabled={isChangingPassword} 
                    className="px-6 py-2.5 bg-accent hover:bg-accent/90 disabled:opacity-50 text-white font-semibold rounded-xl transition-all btn-glow">
                    {isChangingPassword ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </Card>
          )}

        </div>
      </div>
    </PageWrapper>
  );
};

export default Settings;
