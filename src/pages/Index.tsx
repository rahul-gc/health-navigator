import { useAuth } from '@/contexts/AuthContext';
import Auth from './Auth';
import Chat from './Chat';

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) return <Auth />;
  return <Chat />;
};

export default Index;
