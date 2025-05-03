import React from 'react';

export function Card({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-xl border border-[#2a2a2a] bg-[#1e1e1e] text-white shadow-md transition-shadow hover:shadow-lg ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardContent({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-4 sm:p-3 ${className}`} {...props}>
      {children}
    </div>
  );
}
