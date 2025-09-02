'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function MissionsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Missions page error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] px-6">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <AlertCircle className="h-16 w-16 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">
          Erreur de chargement
        </h2>
        <p className="text-muted-foreground max-w-md">
          Une erreur est survenue lors du chargement des missions. Veuillez réessayer.
        </p>
        <Button onClick={reset} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Réessayer
        </Button>
      </div>
    </div>
  );
}
