import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/i18n';
import { toast } from 'sonner';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

// Google Logo SVG Component
const GoogleLogo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20px" height="20px">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    <path fill="none" d="M0 0h48v48H0z"/>
  </svg>
);

// Heartbeat Icon SVG
const HeartbeatIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 text-green-600">
    <path
      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      fill="currentColor"
      fillOpacity="0.2"
    />
    <path
      d="M3 12h3l2-3 3 6 3-9 2 6h4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function Auth() {
  const { language } = useLanguage();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) toast.error(error.message);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: displayName },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        toast.success('Check your email to confirm your account!');
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 p-4">
      {/* Medical Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-green-200/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-green-300/20 rounded-full blur-3xl" />
      </div>

      <div className="absolute top-4 right-4 z-10">
        <LanguageSwitcher />
      </div>

      <Card className="w-full max-w-md border-0 shadow-2xl bg-white/90 backdrop-blur-sm relative overflow-hidden">
        {/* Decorative Header Background */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-green-100/50 to-transparent" />
        
        <CardHeader className="text-center space-y-4 pt-8 relative">
          {/* Logo with Heartbeat */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-green-100 shadow-lg shadow-green-200/50">
            <HeartbeatIcon />
          </div>
          
          <div className="space-y-1">
            <CardTitle className="text-3xl font-bold text-gray-900">
              {t(language, 'appName')}
            </CardTitle>
            <CardDescription className="text-green-600 font-medium">
              {t(language, 'tagline')}
            </CardDescription>
          </div>

          {/* ECG Line Decoration */}
          <div className="flex items-center justify-center gap-2 text-green-500/40">
            <span className="h-px w-12 bg-green-400" />
            <svg viewBox="0 0 24 12" className="h-6 w-8" fill="none">
              <path
                d="M0 6h4l2-4 3 8 3-12 3 8 2-4h4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="h-px w-12 bg-green-400" />
          </div>
        </CardHeader>

        <CardContent className="space-y-6 relative">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <Input
                placeholder={t(language, 'displayName')}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="h-12 rounded-xl border-gray-200 focus:border-green-500 focus:ring-green-500"
              />
            )}
            <Input
              type="email"
              placeholder={t(language, 'email')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 rounded-xl border-gray-200 focus:border-green-500 focus:ring-green-500"
            />
            <Input
              type="password"
              placeholder={t(language, 'password')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="h-12 rounded-xl border-gray-200 focus:border-green-500 focus:ring-green-500"
            />
            <Button 
              type="submit" 
              className="w-full h-12 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg shadow-green-200 transition-all duration-200" 
              disabled={loading}
            >
              {loading ? '...' : isLogin ? t(language, 'login') : t(language, 'signup')}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <span className="relative flex justify-center text-xs text-gray-400 uppercase tracking-wider bg-white/90 px-2">
              or continue with
            </span>
          </div>

          {/* Google Sign In Button */}
          <Button
            type="button"
            variant="outline"
            className="w-full h-12 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 hover:shadow-md hover:border-gray-400 transition-all duration-200 flex items-center justify-center gap-3 font-medium text-gray-700"
            onClick={signInWithGoogle}
            disabled={loading}
          >
            <GoogleLogo />
            Continue with Google
          </Button>

          {/* Toggle Login/Signup */}
          <div className="text-center text-sm text-gray-500">
            {isLogin ? t(language, 'noAccount') : t(language, 'hasAccount')}{' '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="font-semibold text-green-600 hover:text-green-700 hover:underline transition-colors"
            >
              {isLogin ? t(language, 'signup') : t(language, 'login')}
            </button>
          </div>

          {/* Trust Badge */}
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400 pt-2">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-green-500">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Secure & encrypted health data</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
