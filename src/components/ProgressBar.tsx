
import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  current: number;
  target: number;
  className?: string;
  showAmount?: boolean;
  showPercentage?: boolean;
  showText?: boolean;
  textPosition?: 'top' | 'bottom';
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'accent';
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  target,
  className,
  showAmount = true,
  showPercentage = true,
  showText = true,
  textPosition = 'top',
  size = 'md',
  color = 'primary',
}) => {
  const percentage = Math.min(Math.round((current / target) * 100), 100);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5',
  };

  const colorClasses = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    accent: 'bg-accent',
  };

  const progressText = (
    <div className={cn(
      "flex justify-between items-center text-sm",
      textPosition === 'top' ? 'mb-1' : 'mt-2'
    )}>
      {showAmount && (
        <span className="font-medium">
          {formatCurrency(current)} <span className="text-foreground/60">de {formatCurrency(target)}</span>
        </span>
      )}
      {showPercentage && (
        <span className={cn(
          "px-2 py-0.5 rounded-full text-xs font-medium",
          percentage >= 100 ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
        )}>
          {percentage}%
        </span>
      )}
    </div>
  );

  return (
    <div className={cn("w-full", className)}>
      {showText && textPosition === 'top' && progressText}
      
      <div className={cn("w-full bg-gray-100 rounded-full overflow-hidden", sizeClasses[size])}>
        <div 
          className={cn(
            "rounded-full transition-all duration-1000 ease-out", 
            colorClasses[color]
          )} 
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {showText && textPosition === 'bottom' && progressText}
    </div>
  );
};

export default ProgressBar;
