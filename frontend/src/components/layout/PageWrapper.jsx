import { Menu, Bell, Circle } from 'lucide-react';
import Sidebar from './Sidebar';
import { useAuth } from '../../hooks/useAuth';
import { useState, useRef, useEffect } from 'react';

const PageWrapper = ({ children, title }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const { user } = useAuth();
  const notifRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifs(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications = {
    student: [
      { id: 1, title: 'Grade Posted', desc: 'Your grade for Web Dev 101 was updated.', time: '10m ago', unread: true },
      { id: 2, title: 'New Quiz', desc: 'A new CSS Fundamentals quiz is available.', time: '1h ago', unread: true },
      { id: 3, title: 'Attendance Warning', desc: 'You have 2 absences in Advanced Math.', time: '1d ago', unread: false },
    ],
    teacher: [
      { id: 1, title: 'Assignment Submission', desc: '5 students submitted their Web Dev project.', time: '5m ago', unread: true },
      { id: 2, title: 'Schedule Update', desc: 'Your Room 105 class was moved to Room 102.', time: '2h ago', unread: false },
    ],
    admin: [
      { id: 1, title: 'System Backup', desc: 'Automated database backup completed.', time: 'Just now', unread: true },
      { id: 2, title: 'New Teacher Registration', desc: 'John Doe registered as a Teacher.', time: '4h ago', unread: true },
      { id: 3, title: 'Server Load Alert', desc: 'CPU usage exceeded 80% briefly.', time: '1d ago', unread: false },
    ]
  };

  const userNotifs = notifications[user?.role] || [];
  const unreadCount = userNotifs.filter(n => n.unread).length;

  return (
    <div className="flex min-h-screen bg-bg-dark">
      {/* Mobile Sidebar Overlay */}
      <div className={`fixed inset-0 bg-black/60 z-10 transition-opacity md:hidden ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsSidebarOpen(false)} />

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-20 w-64 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 md:pl-64 flex flex-col min-h-screen">
        <header className="h-16 px-6 sm:px-8 border-b border-white/5 flex items-center justify-between sticky top-0 bg-bg-dark/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 -ml-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-alt transition-colors"
              onClick={() => setIsSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg sm:text-xl font-heading font-bold text-text-primary hidden sm:block">{title}</h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications Dropdown */}
            <div className="relative" ref={notifRef}>
              <button onClick={() => setShowNotifs(!showNotifs)}
                className="relative p-2 rounded-xl text-text-muted hover:text-accent hover:bg-accent/10 transition-all group">
                <Bell className="w-5 h-5 group-hover:animate-wiggle" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-danger"></span>
                  </span>
                )}
              </button>

              {/* Dropdown Menu */}
              {showNotifs && (
                <div className="absolute right-0 mt-3 w-80 bg-surface border border-white/10 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden z-50 animate-scaleIn origin-top-right">
                  <div className="px-4 py-3 border-b border-white/5 flex justify-between items-center bg-surface-alt/50">
                    <h3 className="font-bold text-text-primary text-sm">Notifications</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent/20 text-accent">{unreadCount} New</span>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {userNotifs.length > 0 ? userNotifs.map(n => (
                      <div key={n.id} className={`p-4 border-b border-white/5 hover:bg-surface-alt/50 transition-colors cursor-pointer ${n.unread ? 'bg-accent/5' : ''}`}>
                        <div className="flex gap-3">
                          <Circle className={`w-2 h-2 mt-1.5 flex-shrink-0 ${n.unread ? 'text-accent fill-accent' : 'text-transparent'}`} />
                          <div>
                            <p className={`text-sm font-semibold mb-0.5 ${n.unread ? 'text-text-primary' : 'text-text-muted'}`}>{n.title}</p>
                            <p className="text-xs text-text-muted leading-relaxed mb-1.5">{n.desc}</p>
                            <p className="text-[10px] font-semibold text-accent/60 uppercase tracking-wider">{n.time}</p>
                          </div>
                        </div>
                      </div>
                    )) : (
                      <div className="p-8 text-center text-text-muted text-sm">No new notifications</div>
                    )}
                  </div>
                  <div className="p-2 bg-surface-alt/50 border-t border-white/5">
                    <button className="w-full py-2 text-xs font-semibold text-accent hover:text-accent/80 transition-colors">Mark all as read</button>
                  </div>
                </div>
              )}
            </div>

            <div className="h-8 w-8 rounded-xl bg-accent/20 flex items-center justify-center border border-accent/30 shadow-[0_0_15px_rgba(124,111,255,0.2)]">
              <span className="text-accent font-bold font-heading text-sm">{user?.fullname?.charAt(0)?.toUpperCase() || '?'}</span>
            </div>
          </div>
        </header>

        <div className="flex-1 p-6 sm:p-8 w-full max-w-7xl mx-auto">
          <div className="animate-fade-in">{children}</div>
        </div>
      </main>
    </div>
  );
};

export default PageWrapper;
