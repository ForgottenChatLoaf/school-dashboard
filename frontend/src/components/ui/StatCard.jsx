export const StatCard = ({ title, value, icon: Icon, trend, className = '' }) => {
  return (
    <div className={`relative bg-surface border border-white/5 rounded-2xl p-6 overflow-hidden group hover:border-accent/20 transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(124,111,255,0.1)] ${className}`}>
      {/* Background glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-2xl" />

      {/* Top row */}
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="w-11 h-11 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center group-hover:bg-accent/15 transition-colors">
          <Icon className="w-5 h-5 text-accent" />
        </div>
        {trend && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${
            trend.isPositive
              ? 'text-success bg-success/10 border border-success/20'
              : 'text-danger bg-danger/10 border border-danger/20'
          }`}>
            {trend.isPositive ? '↑' : '↓'} {trend.value}%
          </span>
        )}
      </div>

      {/* Value */}
      <div className="relative z-10">
        <p className="text-3xl font-heading font-extrabold text-text-primary tracking-tight leading-none mb-1">
          {value}
        </p>
        <p className="text-sm text-text-muted">{title}</p>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-accent/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};
