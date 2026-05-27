import { X } from 'lucide-react';
import { useEffect } from 'react';

export const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ animation: 'pageFadeIn 0.2s ease' }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative bg-surface border border-white/8 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-10"
        style={{ animation: 'scaleIn 0.25s ease' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <span className="w-1 h-5 bg-accent rounded-full" />
            <h3 className="text-lg font-heading font-bold text-text-primary">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-surface-alt flex items-center justify-center text-text-muted hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};
