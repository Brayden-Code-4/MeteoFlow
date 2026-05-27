/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, AlertTriangle, CheckCircle, Info } from 'lucide-react';

export function Toast({ toasts, onRemove }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <IndividualToast key={toast.id} toast={toast} onRemove={onRemove} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function IndividualToast({ toast, onRemove }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  const config = {
    error: {
      bg: 'bg-red-500/10 border-red-500/20 text-red-200',
      icon: <AlertTriangle className="h-5 w-5 text-red-400 shrink-0" />,
    },
    success: {
      bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200',
      icon: <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />,
    },
    info: {
      bg: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-200',
      icon: <Info className="h-5 w-5 text-indigo-400 shrink-0" />,
    },
  };

  const { bg, icon } = config[toast.type] || config.info;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
      className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-xl shadow-lg shadow-black/30 ${bg}`}
      id={`toast-${toast.id}`}
    >
      {icon}
      <div className="flex-1 text-sm font-medium leading-tight">{toast.text}</div>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-zinc-400 hover:text-zinc-200 transition-colors p-0.5"
        id={`close-toast-${toast.id}`}
        aria-label="Fermer la notification"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
}
