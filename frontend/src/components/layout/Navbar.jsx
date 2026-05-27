import { useAuth } from '../../hooks/useAuth';
import { Bell, Search, User } from 'lucide-react';

const Navbar = ({ pageTitle }) => {
  const { user } = useAuth();

  return (
    <header className="h-16 glass border-b border-white/5 flex items-center justify-between px-6 sticky top-0 z-10"
      style={{ animation: 'pageFadeIn 0.3s ease' }}>
      <div>
        <h1 className="text-lg font-heading font-bold text-text-primary tracking-tight">{pageTitle}</h1>
        <p className="text-xs text-text-muted hidden sm:block">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-xl bg-surface-alt border border-white/5 text-text-muted hover:text-accent hover:border-accent/30 transition-all group">
          <Bell className="w-4 h-4 group-hover:animate-pulse" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-accent rounded-full border-2 border-bg pulse-glow"></span>
        </button>

        <div className="flex items-center gap-2.5 pl-3 border-l border-white/8">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-text-primary leading-tight">{user?.fullname}</p>
            <p className="text-xs text-text-muted capitalize leading-tight">{user?.role}</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-accent/15 flex items-center justify-center border border-accent/20 text-accent font-heading font-bold text-sm flex-shrink-0">
            {user?.fullname?.charAt(0)?.toUpperCase() || <User className="w-4 h-4" />}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
