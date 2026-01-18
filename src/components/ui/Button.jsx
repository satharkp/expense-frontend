import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

const Button = React.forwardRef(({
  className,
  variant = 'primary',
  size = 'default',
  isLoading = false,
  children,
  disabled,
  ...props
}, ref) => {

  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary-800 shadow-sm",
    secondary: "bg-neutral-100 text-neutral-900 hover:bg-neutral-200",
    outline: "border border-neutral-200 bg-transparent hover:bg-neutral-50 text-neutral-900",
    ghost: "hover:bg-neutral-100 text-neutral-700 hover:text-neutral-900",
    destructive: "bg-danger text-danger-foreground hover:bg-danger/90",
  };

  const sizes = {
    default: "h-11 px-6 py-2",
    sm: "h-9 px-4 text-xs",
    lg: "h-12 px-8 text-lg",
    icon: "h-10 w-10",
  };

  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
});

Button.displayName = "Button";

export { Button };
