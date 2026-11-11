import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default:
          'bg-gray-900 text-white shadow hover:bg-gray-800 focus-visible:ring-gray-900',
        primary:
          'bg-primary-600 text-white shadow-sm hover:bg-primary-700 focus-visible:ring-primary-500',
        destructive:
          'bg-red-600 text-white shadow-xs hover:bg-red-700 focus-visible:ring-red-500',
        danger:
          'bg-red-600 text-white shadow-xs hover:bg-red-700 focus-visible:ring-red-500',
        outline:
          'border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 hover:text-gray-900 focus-visible:ring-gray-300',
        secondary:
          'bg-gray-100 text-gray-900 shadow-2xs hover:bg-gray-200 focus-visible:ring-gray-300',
        ghost:
          'text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-gray-300',
        link: 'text-primary-600 underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-lg px-3 text-xs',
        md: 'h-10 px-4 py-2 text-sm',
        lg: 'h-12 rounded-xl px-6 text-base',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
