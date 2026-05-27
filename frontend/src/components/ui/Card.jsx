export const Card = ({ children, className = '', title }) => {
  return (
    <div className={`bg-surface border border-white/5 rounded-2xl shadow-lg p-6 transition-all hover:border-white/10 ${className}`}>
      {title && (
        <h3 className="text-base font-heading font-bold text-text-primary mb-5 flex items-center gap-2">
          <span className="w-1 h-4 bg-accent rounded-full inline-block" />
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};
