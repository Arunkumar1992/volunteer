import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function NotificationToast({ toast, onClose }) {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />,
    error: <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />,
    info: <Info className="h-5 w-5 text-teal-600 shrink-0" />
  };

  const bgClasses = {
    success: 'bg-white border-emerald-300 text-emerald-950',
    error: 'bg-white border-rose-300 text-rose-950',
    info: 'bg-white border-teal-300 text-teal-950'
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-bounce-in max-w-md">
      <div className={`flex items-start gap-3 p-4 rounded-xl border shadow-xl backdrop-blur-md ${bgClasses[toast.type || 'info']}`}>
        {icons[toast.type || 'info']}
        <div className="flex-1 text-sm">
          <h4 className="font-extrabold text-slate-900">{toast.title}</h4>
          <p className="text-xs text-slate-600 mt-0.5 font-medium">{toast.message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
