'use client';

import { cn } from '@/lib/utils';
import { Loader2, X } from 'lucide-react';

export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={cn('h-5 w-5 animate-spin', className)} />;
}

export function Button({
  children,
  variant = 'primary',
  className,
  loading,
  disabled,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'gold' | 'danger' | 'ghost';
  loading?: boolean;
}) {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    gold: 'btn-gold',
    danger: 'btn-danger',
    ghost: 'btn-ghost',
  };

  return (
    <button className={cn(variants[variant], className)} disabled={disabled || loading} {...props}>
      {loading && <Spinner className="h-4 w-4" />}
      {children}
    </button>
  );
}

export function Card({ children, className, hover = true }: { children: React.ReactNode; className?: string; hover?: boolean }) {
  return <div className={cn('card', !hover && 'hover:shadow-sm', className)}>{children}</div>;
}

export function Badge({ children, variant = 'default', className }: { children: React.ReactNode; variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'; className?: string }) {
  const variants = {
    default: 'bg-navy-100 text-navy-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
  };
  return <span className={cn('badge', variants[variant], className)}>{children}</span>;
}

export function Input({ label, error, className, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string }) {
  return (
    <div>
      {label && <label className="label-field">{label}</label>}
      <input className={cn('input-field', error && 'border-red-300 focus:border-red-500 focus:ring-red-200', className)} {...props} />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export function Select({ label, error, children, className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string; error?: string }) {
  return (
    <div>
      {label && <label className="label-field">{label}</label>}
      <select className={cn('input-field cursor-pointer', error && 'border-red-300', className)} {...props}>
        {children}
      </select>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export function Textarea({ label, error, className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; error?: string }) {
  return (
    <div>
      {label && <label className="label-field">{label}</label>}
      <textarea className={cn('input-field resize-none', error && 'border-red-300', className)} {...props} />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description, action }: { icon: any; title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 rounded-full bg-navy-50 p-4">
        <Icon className="h-8 w-8 text-navy-300" />
      </div>
      <h3 className="text-lg font-semibold text-navy-900">{title}</h3>
      {description && <p className="mt-1 text-sm text-navy-500 max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('skeleton', className)} />;
}

export function ProgressBar({ value, max = 100, className, color = 'navy' }: { value: number; max?: number; className?: string; color?: 'navy' | 'green' | 'gold' | 'red' }) {
  const percentage = Math.min((value / max) * 100, 100);
  const colors = {
    navy: 'bg-navy-600',
    green: 'bg-green-500',
    gold: 'bg-gold-500',
    red: 'bg-red-500',
  };
  return (
    <div className={cn('h-2 w-full rounded-full bg-navy-100 overflow-hidden', className)}>
      <div className={cn('h-full rounded-full transition-all duration-500', colors[color])} style={{ width: `${percentage}%` }} />
    </div>
  );
}

export function Modal({ open, onClose, title, children, size = 'md' }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode; size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  if (!open) return null;
  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-navy-950/50 backdrop-blur-sm" onClick={onClose} />
      <div className={cn('relative w-full rounded-xl bg-white shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto', sizes[size])}>
        <div className="flex items-center justify-between border-b border-navy-100 px-6 py-4 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold text-navy-900">{title}</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-navy-400 hover:bg-navy-50 hover:text-navy-700">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', danger }: { open: boolean; onClose: () => void; onConfirm: () => void; title: string; message: string; confirmText?: string; cancelText?: string; danger?: boolean }) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <p className="text-sm text-navy-600">{message}</p>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose}>{cancelText}</Button>
        <Button variant={danger ? 'danger' : 'primary'} onClick={() => { onConfirm(); onClose(); }}>{confirmText}</Button>
      </div>
    </Modal>
  );
}
