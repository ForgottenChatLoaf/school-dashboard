import { useAuth } from '../../hooks/useAuth';
import { Home, Users, CheckSquare, FileText, Calendar, Settings, LogOut, ChevronRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const { user, logout } = useAuth();

  const getNavItems = () => {
    const baseItems = [{ name: 'Dashboard', icon: Home, path: `/${user?.role}` }];

    if (user?.role === 'admin') {
      baseItems.push(
        { name: 'Students', icon: Users, path: '/admin/students' },
        { name: 'Attendance', icon: CheckSquare, path: '/admin/attendance' },
        { name: 'Gradebook', icon: FileText, path: '/admin/grades' },
      );
    } else if (user?.role === 'teacher') {
      baseItems.push(
        { name: 'Attendance', icon: CheckSquare, path: '/teacher/attendance' },
        { name: 'Gradebook', icon: FileText, path: '/teacher/grades' },
        { name: 'Schedule', icon: Calendar, path: '/teacher/schedule' },
      );
    } else if (user?.role === 'student') {
      baseItems.push(
        { name: 'My Grades', icon: FileText, path: '/student/grades' },
        { name: 'My Attendance', icon: CheckSquare, path: '/student/attendance' },
        { name: 'Schedule', icon: Calendar, path: '/student/schedule' },
      );
    }

    baseItems.push({ name: 'Settings', icon: Settings, path: '/settings' });
    return baseItems;
  };

  const navItems = getNavItems();
  const roleColors = { admin: 'text-purple-400 bg-purple-400/10', teacher: 'text-blue-400 bg-blue-400/10', student: 'text-green-400 bg-green-400/10' };
  const roleLabel = { admin: 'Administrator', teacher: 'Teacher', student: 'Student' };

  return (
    <aside className="w-64 h-screen bg-surface border-r border-white/5 flex flex-col fixed left-0 top-0 z-20"
      style={{ animation: 'slideInLeft 0.4s ease' }}>

      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-white/5 gap-3">
        <div className="relative flex-shrink-0">
          <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
          <div className="absolute inset-0 bg-accent/30 rounded-full blur-lg" />
        </div>
        <div>
          <h2 className="text-lg font-heading font-bold text-text-primary leading-none tracking-tight">
            School<span className="text-accent">Dash</span>
          </h2>
          <p className="text-[10px] text-text-muted mt-0.5 leading-none">Management System</p>
        </div>
      </div>

      {/* User badge */}
      <div className="px-4 py-4 border-b border-white/5">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-alt">
          <div className="w-9 h-9 rounded-full bg-accent/15 flex items-center justify-center border border-accent/20 flex-shrink-0">
            <span className="text-accent font-bold font-heading text-sm">
              {user?.fullname?.charAt(0)?.toUpperCase() || '?'}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-text-primary truncate leading-tight">{user?.fullname}</p>
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${roleColors[user?.role]} mt-0.5 inline-block`}>
              {roleLabel[user?.role]}
            </span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted px-3 mb-2">Menu</p>
        {navItems.map((item, i) => {
          const Icon = item.icon;
          return (
            <NavLink key={item.name} to={item.path} end={item.path === `/${user?.role}`}
              style={{ animationDelay: `${i * 0.05}s` }}
              className={({ isActive }) =>
                `relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium group ${
                  isActive
                    ? 'bg-accent/10 text-accent'
                    : 'text-text-muted hover:bg-surface-alt hover:text-text-primary'
                }`
              }>
              {({ isActive }) => (
                <>
                  {isActive && <span className="nav-active-indicator" />}
                  <Icon className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-accent' : ''}`} />
                  <span className="flex-1">{item.name}</span>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-accent/60" />}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-white/5">
        <button onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-text-muted hover:bg-danger/10 hover:text-danger transition-all font-medium text-sm group">
          <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
