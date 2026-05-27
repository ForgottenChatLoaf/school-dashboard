import { useState } from 'react';
import PageWrapper from '../../components/layout/PageWrapper';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../hooks/useAuth';
import { User, Bell, Shield, Moon } from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  const handleSave = () => {
    toast.success('Settings saved successfully!');
  };

  return (
    <PageWrapper title="Account Settings">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Sidebar Nav (Visual Only) */}
        <div className="md:col-span-1 space-y-2 stagger-1">
          <Card className="!p-3">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-accent/10 text-accent font-semibold transition-all">
              <User className="w-5 h-5" /> Profile Info
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-alt transition-all">
              <Bell className="w-5 h-5" /> Notifications
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-alt transition-all">
              <Shield className="w-5 h-5" /> Security
            </button>
          </Card>
        </div>

        {/* Main Settings Form */}
        <div className="md:col-span-2 space-y-6 stagger-2">
          <Card title="Profile Information">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Email Address</label>
                <input type="email" disabled value={user?.email || 'user@example.com'} 
                  className="w-full px-4 py-2.5 bg-surface-alt/50 border border-white/5 rounded-xl text-text-muted cursor-not-allowed" />
                <p className="text-xs text-text-muted mt-2">Your email address cannot be changed right now.</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Role</label>
                <input type="text" disabled value={user?.role?.toUpperCase() || 'USER'} 
                  className="w-full px-4 py-2.5 bg-surface-alt/50 border border-white/5 rounded-xl text-text-muted cursor-not-allowed font-bold" />
              </div>
            </div>
          </Card>

          <Card title="Preferences">
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

          <div className="flex justify-end">
            <button onClick={handleSave} className="px-6 py-2.5 bg-accent hover:bg-accent/90 text-white font-semibold rounded-xl transition-all btn-glow">
              Save Changes
            </button>
          </div>
        </div>

      </div>
    </PageWrapper>
  );
};

export default Settings;
