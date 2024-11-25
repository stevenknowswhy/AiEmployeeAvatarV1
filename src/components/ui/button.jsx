import React from 'react';
import { clsx } from 'clsx';

export const Button = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
