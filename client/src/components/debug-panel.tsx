import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { queryClient } from '@/lib/queryClient';

export function DebugPanel() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const resetCache = () => {
    queryClient.clear();
    localStorage.removeItem('futureUser');
    window.location.reload();
  };

  const refreshQueries = () => {
    queryClient.invalidateQueries();
  };

  if (!isOpen) {
    return (
      <Button 
        className="fixed bottom-4 right-4 z-50 bg-gray-800 text-white opacity-50 hover:opacity-100"
        onClick={() => setIsOpen(true)}
      >
        Debug
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-80 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex justify-between items-center">
          Debug Panel
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>×</Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-xs space-y-2">
        <div>
          <strong>User ID:</strong> {user?.id}
        </div>
        <div>
          <strong>Username:</strong> {user?.username}
        </div>
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" onClick={refreshQueries}>
            Refresh Data
          </Button>
          <Button size="sm" variant="outline" onClick={resetCache}>
            Reset Cache
          </Button>
          <Button size="sm" variant="outline" onClick={logout}>
            Logout
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}