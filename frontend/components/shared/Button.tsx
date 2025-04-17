import React from 'react';
import { Loader2 } from 'lucide-react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LoadingButtonProps extends ButtonProps {
  isLoading?: boolean;
  className?: string;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading = false,
  disabled,
  children,
  className,
  ...props
}) => {
  return (
    <Button
      disabled={disabled || isLoading}
      className={cn('flex items-center justify-center gap-2', className)}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </Button>
  );
};

export default LoadingButton;
