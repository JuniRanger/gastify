import { AlertCircle } from 'lucide-react';
import { Button } from './Button';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div role="alert" className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-3">
      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" aria-hidden />
      <div className="flex-1">
        <p className="text-sm text-red-800">{message}</p>
        {onRetry && (
          <Button variant="secondary" size="sm" className="mt-2" onClick={onRetry}>
            Reintentar
          </Button>
        )}
      </div>
    </div>
  );
}
