import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export const showToast = (message, type = 'info') => {
  const event = new CustomEvent('show-toast', { detail: { message, type } });
  window.dispatchEvent(event);
};

export default function Toast() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleShowToast = (e) => {
      const newToast = { id: uuidv4(), ...e.detail };
      setToasts((prev) => [...prev, newToast]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 3000);
    };

    window.addEventListener('show-toast', handleShowToast);
    return () => window.removeEventListener('show-toast', handleShowToast);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg pointer-events-auto animate-in slide-in-from-right-8 fade-in duration-300 ${
            toast.type === 'success' ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' :
            toast.type === 'error' ? 'bg-red-50 text-red-900 border border-red-200' :
            toast.type === 'warning' ? 'bg-amber-50 text-amber-900 border border-amber-200' :
            'bg-zinc-50 text-zinc-900 border border-zinc-200'
          }`}
        >
          {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-600" />}
          {toast.type === 'error' && <XCircle className="w-5 h-5 text-red-600" />}
          {toast.type === 'warning' && <AlertCircle className="w-5 h-5 text-amber-600" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-zinc-600" />}
          
          <p className="text-sm font-medium">{toast.message}</p>
          
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-4 text-slate-400 hover:text-slate-600 focus:outline-none"
          >
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
