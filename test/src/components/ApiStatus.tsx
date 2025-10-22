import React from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { CheckCircle, AlertCircle, Loader2, RefreshCw } from 'lucide-react';

interface ApiStatusProps {
  loading: boolean;
  error: any;
  onRetry?: () => void;
}

export const ApiStatus: React.FC<ApiStatusProps> = ({ loading, error, onRetry }) => {
  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
        <Badge variant="outline" className="text-blue-600">
          Подключение к API...
        </Badge>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <AlertCircle className="h-4 w-4 text-red-500" />
        <Badge variant="destructive">
          Ошибка API: {error.message}
        </Badge>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="h-6 px-2 text-xs"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Повторить
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <CheckCircle className="h-4 w-4 text-green-500" />
      <Badge variant="outline" className="text-green-600">
        API подключен
      </Badge>
    </div>
  );
};
