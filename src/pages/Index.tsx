import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Activity, Calendar, AlertTriangle, Phone, MapPin, TrendingUp, Users, Mountain, Sparkles, Shield, Zap, Clock, ChevronRight, Stethoscope, Pill, Droplet, FootprintsIcon, Brain, Eye, Syringe, FileText, Video, MessageCircle, Star, Award, Target, Flame, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { toast } from 'sonner';
import DashboardLayout from '@/components/DashboardLayout';

const Index = () => {
  const { user, loading } = useAuth();
  const { language } = useLanguage();
  const [vitals, setVitals] = useState<any>(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground text-body">Loading...</div>
      </div>
    );
  }

  if (!user) {
    // Show landing page for non-authenticated users
    return (
      <div className="min-h-screen bg-medical-pattern relative overflow-hidden">
        {/* Professional medical background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-red-500/10 to-red-600/10 rounded-full blur-2xl massive-float"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-full blur-2xl massive-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-full blur-2xl massive-float" style={{ animationDelay: '2s' }}></div>
          
          {/* Floating medical crosses */}
          <div className="absolute top-32 left-1/4 text-4xl text-red-500/20 massive-float" style={{ animationDelay: '0.5s' }}>+</div>
          <div className="absolute top-64 right-1/4 text-3xl text-blue-500/20 massive-float" style={{ animationDelay: '1.5s' }}>+</div>
          <div className="absolute bottom-32 left-1/3 text-4xl text-green-500/20 massive-float" style={{ animationDelay: '2.5s' }}>+</div>
          <div className="absolute bottom-64 right-1/3 text-3xl text-red-500/20 massive-float" style={{ animationDelay: '3s' }}>+</div>
          <div className="absolute top-1/2 left-1/6 text-2xl text-blue-500/20 massive-float" style={{ animationDelay: '3.5s' }}>+</div>
          <div className="absolute top-1/3 right-1/6 text-3xl text-green-500/20 massive-float" style={{ animationDelay: '4s' }}>+</div>
        </div>

        {/* Professional Red Cross header */}
        <header className="relative z-10 bg-glass backdrop-blur-xl border-b border-red-200/30">
          <div className="absolute top-0 right-0 w-32 h-32 opacity-30 massive-float">
            <Mountain className="w-full h-full text-red-600" />
          </div>
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg glow massive-float">
                <div className="text-white text-lg font-bold">+</div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-red-600" style={{ fontFamily: 'Mukta Malar, sans-serif' }}>
                  स्वास्थ्य सहायक
                </h1>
                <p className="text-sm text-blue-600 font-semibold">Swasthya Sahayak</p>
              </div>
            </div>
          </div>
        </header>

        {/* Professional Hero Section */}
        <section className="relative z-10 container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <div className="inline-flex items-center gap-3 px-6 py-2 bg-gradient-to-r from-red-500/20 via-blue-500/20 to-green-500/20 border border-red-300 text-red-800 rounded-full text-sm font-semibold shadow-lg backdrop-blur-sm massive-float">
                <Sparkles className="w-4 h-4 bounce-colorful" />
                Red Cross Certified Medical Platform
                <Sparkles className="w-4 h-4 bounce-colorful" />
              </div>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight" style={{ fontFamily: 'Mukta Malar, sans-serif' }}>
              <span className="text-red-600">स्वस्थ रहनुहोस्</span><br/>
              <span className="text-gradient bg-gradient-to-r from-red-500 via-blue-500 to-green-500 bg-clip-text text-transparent">
                Stay Healthy
              </span>
            </h2>
            
            <p className="text-lg md:text-xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed font-semibold">
              Professional healthcare guidance with Red Cross standards - trusted medical support in beautiful Nepali and English
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <button className="btn-gradient text-base px-8 py-3 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                Get Started Now
              </button>
              <button className="btn-glass text-base px-8 py-3 border border-red-300 text-red-700 hover:bg-red-50 transform hover:scale-105 transition-all duration-300 shadow-md">
                Learn More
              </button>
            </div>

            {/* Professional feature highlights */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="text-center p-4 rounded-xl bg-glass backdrop-blur-sm border border-red-200/40 shadow-lg group hover:scale-105 transition-all duration-300 massive-float">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:rotate-12 transition-transform glow">
                  <Stethoscope className="w-6 h-6 text-white" />
                </div>
                <p className="font-semibold text-sm text-gray-800">Medical Check</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-glass backdrop-blur-sm border border-blue-200/40 shadow-lg group hover:scale-105 transition-all duration-300 massive-float" style={{ animationDelay: '0.5s' }}>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:rotate-12 transition-transform glow">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <p className="font-semibold text-sm text-gray-800">Track Vitals</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-glass backdrop-blur-sm border border-green-200/40 shadow-lg group hover:scale-105 transition-all duration-300 massive-float" style={{ animationDelay: '1s' }}>
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:rotate-12 transition-transform glow">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <p className="font-semibold text-sm text-gray-800">Find Hospitals</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-glass backdrop-blur-sm border border-red-200/40 shadow-lg group hover:scale-105 transition-all duration-300 massive-float" style={{ animationDelay: '1.5s' }}>
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:rotate-12 transition-transform glow">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <p className="font-semibold text-sm text-gray-800">Emergency SOS</p>
              </div>
            </div>
          </div>
        </section>

        {/* Professional Emergency Banner */}
        <section className="relative z-10 bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-white py-12 shadow-lg">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/40 massive-float">
                  <Zap className="w-8 h-8 text-yellow-300 bounce-colorful" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-1 text-white">24/7 Emergency Services</h3>
                  <p className="text-white/90 text-base font-semibold">Health Helpline: <span className="font-bold text-yellow-300">102</span> | Ambulance: <span className="font-bold text-yellow-300">110</span></p>
                </div>
              </div>
              <button className="bg-white text-red-600 hover:bg-gray-100 font-bold text-base px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Call Emergency Now
              </button>
            </div>
          </div>
        </section>

        {/* Professional Features Grid */}
        <section className="relative z-10 container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-red-600" style={{ fontFamily: 'Mukta Malar, sans-serif' }}>
              Professional Medical Services
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto font-semibold">
              Red Cross certified healthcare solutions for your wellbeing
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="nepal-card group cursor-pointer">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg glow">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl mb-2">
                  <div className="bilingual">
                    <span className="primary">AI Medical Analysis</span>
                    <span className="secondary text-gray-600">स्वास्थ्य जाँच</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-body text-gray-700 leading-relaxed font-medium">
                  Professional AI-powered health analysis with Red Cross medical standards and personalized health recommendations
                </p>
              </CardContent>
            </Card>

            <Card className="nepal-card group cursor-pointer" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg glow">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl mb-2">
                  <div className="bilingual">
                    <span className="primary">Professional Vitals</span>
                    <span className="secondary text-gray-600">आवश्यक नाप</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-body text-gray-700 leading-relaxed font-medium">
                  Medical-grade vital tracking with professional insights and comprehensive health monitoring systems
                </p>
              </CardContent>
            </Card>

            <Card className="nepal-card group cursor-pointer" style={{ animationDelay: '0.4s' }}>
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg glow">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl mb-2">
                  <div className="bilingual">
                    <span className="primary">Medical Directory</span>
                    <span className="secondary text-gray-600">अस्पताल खोज्नुहोस्</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-body text-gray-700 leading-relaxed font-medium">
                  Comprehensive directory of certified hospitals, clinics, and medical professionals across Nepal
                </p>
              </CardContent>
            </Card>

            <Card className="nepal-card group cursor-pointer" style={{ animationDelay: '0.6s' }}>
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg glow">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl mb-2">
                  <div className="bilingual">
                    <span className="primary">Medical Appointments</span>
                    <span className="secondary text-gray-600">भेटघाट</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-body text-gray-700 leading-relaxed font-medium">
                  Professional appointment scheduling with certified healthcare providers and automated reminders
                </p>
              </CardContent>
            </Card>

            <Card className="nepal-card group cursor-pointer" style={{ animationDelay: '0.8s' }}>
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg glow">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl mb-2">
                  <div className="bilingual">
                    <span className="primary">Emergency Response</span>
                    <span className="secondary text-gray-600">आपतकालीन सहायता</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-body text-gray-700 leading-relaxed font-medium">
                  Red Cross certified emergency response system with instant medical assistance and location tracking
                </p>
              </CardContent>
            </Card>

            <Card className="nepal-card group cursor-pointer" style={{ animationDelay: '1s' }}>
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg glow">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl mb-2">
                  <div className="bilingual">
                    <span className="primary">Medical Assistant</span>
                    <span className="secondary text-gray-600">स्वास्थ्य सहायक</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-body text-gray-700 leading-relaxed font-medium">
                  24/7 professional medical assistance in Nepali and English with certified healthcare information
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Professional Footer */}
        <footer className="relative z-10 bg-gradient-to-br from-red-900 via-gray-900 to-blue-900 text-white py-12 mt-16">
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="relative container mx-auto px-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg glow massive-float">
                  <div className="text-white text-2xl font-bold">+</div>
                </div>
                <div>
                  <span className="text-2xl font-bold text-white" style={{ fontFamily: 'Mukta Malar, sans-serif' }}>
                    स्वास्थ्य सहायक
                  </span>
                  <p className="text-blue-200 text-base font-semibold">Swasthya Sahayak</p>
                </div>
              </div>
              <p className="text-blue-100 text-base mb-8 max-w-2xl mx-auto font-semibold">
                Red Cross certified medical platform bringing professional healthcare to every corner of Nepal
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-blue-200 text-sm font-semibold">
                <span className="bg-white/10 px-3 py-1 rounded-xl backdrop-blur-sm">🏥 Red Cross Certified</span>
                <span className="bg-white/10 px-3 py-1 rounded-xl backdrop-blur-sm">👨‍⚕️ Professional Doctors</span>
                <span className="bg-white/10 px-3 py-1 rounded-xl backdrop-blur-sm">📍 All 77 Districts</span>
                <span className="bg-white/10 px-3 py-1 rounded-xl backdrop-blur-sm">🇳🇵 Made for Nepal</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // Authenticated user sees dashboard
  return <DashboardPage />;
};

// Dashboard component for authenticated users
const DashboardPage = () => {
  const { user, profile } = useAuth();
  const { language } = useLanguage();
  const [vitals, setVitals] = useState<any>(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);

  useEffect(() => {
    loadVitals();
    loadAppointments();
  }, [user]);

  const loadVitals = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('vitals_log')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1);
    if (data && data.length > 0) setVitals(data[0]);
  };

  const loadAppointments = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('conversations') // Using conversations table instead
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (error) {
      console.error('Error loading appointments:', error);
      return;
    }
    
    // Transform conversations to appointment-like format
    const formattedAppointments = data?.map(conv => ({
      id: conv.id,
      title: conv.title || 'Health Consultation',
      date: conv.created_at,
      type: 'consultation'
    })) || [];
    
    setUpcomingAppointments(formattedAppointments);
  };

  return (
    <DashboardLayout title="Dashboard">
      {/* ChatGPT-style Emergency SOS Button */}
      <button className="fixed bottom-6 right-6 w-14 h-14 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50">
        <Phone className="w-6 h-6" />
      </button>

      {/* Gemini-style Welcome Section */}
      <div className="mb-8 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Welcome back, {profile?.full_name?.split(' ')[0] || 'User'}!
            </h1>
            <p className="text-gray-600">Here's your personalized health overview for today</p>
          </div>
        </div>
        <div className="flex gap-3">
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">📍 Kathmandu, Nepal</span>
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">🌤️ Partly Cloudy</span>
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">💊 2 Medications Today</span>
        </div>
      </div>

      {/* ChatGPT-style Health Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-pink-600" />
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">Normal</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{vitals?.heart_rate || '--'}</div>
          <div className="text-sm text-gray-500">bpm</div>
          <div className="text-sm font-medium text-gray-700 mt-1">Heart Rate</div>
          <div className="mt-3 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full w-3/4 bg-pink-500 rounded-full"></div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">Good</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {vitals?.blood_pressure_systolic || '--'}/{vitals?.blood_pressure_diastolic || '--'}
          </div>
          <div className="text-sm text-gray-500">mmHg</div>
          <div className="text-sm font-medium text-gray-700 mt-1">Blood Pressure</div>
          <div className="mt-3 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full w-2/3 bg-blue-500 rounded-full"></div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-amber-600" />
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">Healthy</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {profile?.bmi ? profile.bmi.toFixed(1) : '--'}
          </div>
          <div className="text-sm text-gray-500">kg/m²</div>
          <div className="text-sm font-medium text-gray-700 mt-1">BMI</div>
          <div className="mt-3 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full w-4/5 bg-amber-500 rounded-full"></div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">{upcomingAppointments.length} Soon</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{upcomingAppointments.length || '0'}</div>
          <div className="text-sm text-gray-500">appointments</div>
          <div className="text-sm font-medium text-gray-700 mt-1">Appointments</div>
          <div className="mt-3 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full w-1/2 bg-purple-500 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Gemini-style Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-left">
            <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center mb-3">
              <Activity className="w-4 h-4 text-pink-600" />
            </div>
            <div className="text-sm font-medium text-gray-900">Log Vitals</div>
            <div className="text-xs text-gray-500">Track health metrics</div>
          </button>
          <button className="p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-left">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
              <MapPin className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-sm font-medium text-gray-900">Find Hospital</div>
            <div className="text-xs text-gray-500">Nearby facilities</div>
          </button>
          <button className="p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-left">
            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center mb-3">
              <Calendar className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-sm font-medium text-gray-900">Book Appointment</div>
            <div className="text-xs text-gray-500">Schedule visit</div>
          </button>
          <button className="p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-left">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
              <Brain className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-sm font-medium text-gray-900">Health Check</div>
            <div className="text-xs text-gray-500">AI analysis</div>
          </button>
        </div>
      </div>

      {/* ChatGPT-style Upcoming Appointments */}
      {upcomingAppointments.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-600" />
              Upcoming Appointments
            </h2>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {upcomingAppointments.map((apt, index) => (
                <div key={apt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600 font-semibold">
                      {new Date(apt.date).getDate()}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        Dr. {apt.doctor_name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(apt.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </div>
                      <div className="text-xs text-amber-600">
                        {new Date(apt.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                  <button className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-lg transition-colors">
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Massive Health Tips Section */}
      <Card className="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-4 text-2xl">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            Today's Health Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-white/80 rounded-3xl border-2 border-pink-200 hover:shadow-2xl transition-all duration-500 group massive-float">
              <p className="font-black text-xl text-pink-700 mb-3 flex items-center gap-3">
                <Droplet className="w-6 h-6 group-hover:scale-125 transition-transform bounce-colorful" />
                Stay Hydrated
              </p>
              <p className="text-lg text-gray-600 font-medium">Drink at least 8 glasses of water today</p>
            </div>
            <div className="p-6 bg-white/80 rounded-3xl border-2 border-blue-200 hover:shadow-2xl transition-all duration-500 group massive-float" style={{ animationDelay: '0.3s' }}>
              <p className="font-black text-xl text-blue-700 mb-3 flex items-center gap-3">
                <FootprintsIcon className="w-6 h-6 group-hover:scale-125 transition-transform bounce-colorful" />
                Move More
              </p>
              <p className="text-lg text-gray-600 font-medium">Take a 10-minute walk after meals</p>
            </div>
            <div className="p-6 bg-white/80 rounded-3xl border-2 border-purple-200 hover:shadow-2xl transition-all duration-500 group massive-float" style={{ animationDelay: '0.6s' }}>
              <p className="font-black text-xl text-purple-700 mb-3 flex items-center gap-3">
                <Brain className="w-6 h-6 group-hover:scale-125 transition-transform bounce-colorful" />
                Sleep Well
              </p>
              <p className="text-lg text-gray-600 font-medium">Aim for 7-8 hours of quality sleep</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Index;
