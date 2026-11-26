import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLElement> {
  title?: string;
  action?: ReactNode;
}

export function Card({ title, action, children, className = '', ...rest }: CardProps) {
  return (
    <section className={`rounded-2xl bg-white p-4 shadow-card sm:p-5 ${className}`} {...rest}>
      {(title || action) && (
        <header className="mb-4 flex items-center justify-between gap-3">
          {title && <h2 className="text-base font-semibold text-slate-900">{title}</h2>}
          {action}
        </header>
      )}
      {children}
    </section>
  );
}
