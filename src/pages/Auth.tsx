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
    <div className="min-h-screen bg-medical-pattern relative overflow-hidden flex items-center justify-center">
      {/* Professional medical background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-red-500/10 to-red-600/10 rounded-full blur-3xl massive-float"></div>
        <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-full blur-3xl massive-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-full blur-3xl massive-float" style={{ animationDelay: '2s' }}></div>
        
        {/* Floating medical symbols */}
        <div className="absolute top-32 left-1/4 text-6xl text-red-500/20 massive-float" style={{ animationDelay: '0.5s' }}>+</div>
        <div className="absolute top-64 right-1/4 text-5xl text-blue-500/20 massive-float" style={{ animationDelay: '1.5s' }}>+</div>
        <div className="absolute bottom-32 left-1/3 text-6xl text-green-500/20 massive-float" style={{ animationDelay: '2.5s' }}>+</div>
        <div className="absolute bottom-64 right-1/3 text-5xl text-red-500/20 massive-float" style={{ animationDelay: '3s' }}>+</div>
        <div className="absolute top-1/2 left-1/6 text-4xl text-blue-500/20 massive-float" style={{ animationDelay: '3.5s' }}>+</div>
        <div className="absolute top-1/3 right-1/6 text-5xl text-green-500/20 massive-float" style={{ animationDelay: '4s' }}>+</div>
      </div>

      <div className="absolute top-4 right-4 z-10">
        <LanguageSwitcher />
      </div>

      <Card className="w-full max-w-md border-0 shadow-xl bg-glass backdrop-blur-xl relative overflow-hidden massive-float z-10">
        {/* Red Cross Header Background */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-red-500/20 via-red-400/10 to-transparent" />
        
        <CardHeader className="text-center space-y-4 pt-8 relative">
          {/* Red Cross Logo */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg glow massive-float">
            <div className="text-white text-2xl font-bold">+</div>
          </div>
          
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold text-red-600" style={{ fontFamily: 'Mukta Malar, sans-serif' }}>
              {t(language, 'appName')}
            </CardTitle>
            <CardDescription className="text-sm text-blue-600 font-semibold">
              {t(language, 'tagline')}
            </CardDescription>
          </div>

          {/* Medical Cross Line Decoration */}
          <div className="flex items-center justify-center gap-2 text-red-500/60">
            <span className="h-0.5 w-12 bg-gradient-to-r from-red-500 to-blue-500 rounded-full" />
            <div className="text-lg font-bold text-red-500">+</div>
            <span className="h-0.5 w-12 bg-gradient-to-r from-blue-500 to-red-500 rounded-full" />
          </div>
        </CardHeader>

        <CardContent className="space-y-6 relative">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <Input
                placeholder={t(language, 'displayName')}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="h-10 rounded-xl border border-red-200 focus:border-red-500 focus:ring-red-500 text-sm font-medium"
              />
            )}
            <Input
              type="email"
              placeholder={t(language, 'email')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-10 rounded-xl border border-red-200 focus:border-red-500 focus:ring-red-500 text-sm font-medium"
            />
            <Input
              type="password"
              placeholder={t(language, 'password')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="h-10 rounded-xl border border-red-200 focus:border-red-500 focus:ring-red-500 text-sm font-medium"
            />
            <Button 
              type="submit" 
              className="w-full h-10 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold text-base shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300" 
              disabled={loading}
            >
              {loading ? '...' : isLogin ? t(language, 'login') : t(language, 'signup')}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border border-red-200" />
            </div>
            <span className="relative flex justify-center text-sm text-red-400 uppercase tracking-wider bg-white/90 px-3 font-semibold">
              or continue with
            </span>
          </div>

          {/* Google Sign In - Simple Professional Button */}
          <Button
            onClick={signInWithGoogle}
            variant="outline"
            className="btn-google text-gray-700 font-medium text-sm py-2 px-4 rounded-xl shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-300 w-full h-10"
            disabled={loading}
          >
            <GoogleLogo />
            Continue with Google
          </Button>

          {/* Toggle Login/Signup */}
          <div className="text-center text-sm text-gray-600 font-medium">
            {isLogin ? t(language, 'noAccount') : t(language, 'hasAccount')}{' '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="font-bold text-sm text-red-600 hover:text-red-700 hover:underline transition-all duration-300"
            >
              {isLogin ? t(language, 'signup') : t(language, 'login')}
            </button>
          </div>

          {/* Trust Badge */}
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500 pt-2 font-medium">
            <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">+</span>
            </div>
            <span>Red Cross Certified Medical Platform</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
