'use client';
// components/mou/MouToast.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Lightweight toast notification system replacing SweetAlert2 from Angular.
// Toasts auto-dismiss after 3.5 s.
// ─────────────────────────────────────────────────────────────────────────────

import styles from '../../styles/mou.module.css';

export interface ToastItem {
  id:      number;
  message: string;
  type:    'success' | 'error' | 'warning';
}

interface MouToastProps {
  toasts: ToastItem[];
}

const TOAST_ICONS: Record<ToastItem['type'], string> = {
  success: '✔',
  error:   '✘',
  warning: '⚠',
};

const TOAST_CLASS: Record<ToastItem['type'], string> = {
  success: styles.toastSuccess,
  error:   styles.toastError,
  warning: styles.toastWarning,
};

export default function MouToast({ toasts }: MouToastProps) {
  if (toasts.length === 0) return null;

  return (
    <div className={styles.toastContainer}>
      {toasts.map(t => (
        <div key={t.id} className={`${styles.toast} ${TOAST_CLASS[t.type]}`}>
          <span className={styles.toastIcon}>{TOAST_ICONS[t.type]}</span>
          {t.message}
        </div>
      ))}
    </div>
  );
}
