import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const icons = {
  success: <CheckCircle size={18} className="text-emerald-500" />,
  error: <XCircle size={18} className="text-red-500" />,
  warning: <AlertTriangle size={18} className="text-amber-500" />,
  info: <Info size={18} className="text-blue-500" />,
};

const bgMap = {
  success: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800',
  error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
  warning: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
  info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
};

export const Toast = ({ message, type = 'info', onClose, duration = 4000 }) => {
  useEffect(() => {
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [onClose, duration]);

  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg max-w-sm w-full animate-slide-in ${bgMap[type]}`}>
      {icons[type]}
      <p className="text-sm text-slate-700 dark:text-slate-200 flex-1">{message}</p>
      <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
        <X size={16} />
      </button>
    </div>
  );
};

// Global toast container — place at app root
let _addToast = null;

export const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    _addToast = ({ message, type }) => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, message, type }]);
    };
    return () => { _addToast = null; };
  }, []);

  const remove = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 items-end">
      {toasts.map((t) => (
        <Toast key={t.id} message={t.message} type={t.type} onClose={() => remove(t.id)} />
      ))}
    </div>
  );
};

export const toast = {
  success: (msg) => _addToast?.({ message: msg, type: 'success' }),
  error: (msg) => _addToast?.({ message: msg, type: 'error' }),
  warning: (msg) => _addToast?.({ message: msg, type: 'warning' }),
  info: (msg) => _addToast?.({ message: msg, type: 'info' }),
};
