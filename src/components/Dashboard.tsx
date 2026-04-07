import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import OnboardingModal from './OnboardingModal';
import DashboardLayout from './DashboardLayout';
import { 
  Heart, 
  Activity, 
  User, 
  Target, 
  TrendingUp,
  Droplets,
  Moon,
  Plus,
  Settings,
  FileText,
  MapPin,
  Bell
} from 'lucide-react';
import { format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import VitalsModal from './VitalsModal';

interface Profile {
  full_name: string;
  age: number;
  gender: string;
  height_cm: number;
  weight_kg: number;
  bmi: number;
  blood_group: string;
  conditions: string[];
  medications: string;
  allergies: string;
  smoker: string;
  drinker: string;
  activity_level: string;
  health_goal: string;
  reminder_freq: string;
  avatar_url: string;
}

interface VitalsLog {
  id: string;
  log_date: string;
  bp_systolic: number;
  bp_diastolic: number;
  blood_sugar: number;
  heart_rate: number;
  weight_kg: number;
  sleep_hours: number;
}

export default function Dashboard() {
  const { user, profile, refreshProfile } = useAuth();
  const [vitals, setVitals] = useState<VitalsLog[]>([]);
  const [showVitalsModal, setShowVitalsModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [healthTip, setHealthTip] = useState('');
  const { toast } = useToast();

  const healthTips = [
    'Drink at least 8 glasses of water daily for optimal hydration.',
    'Take a 10-minute walk after meals to aid digestion.',
    'Practice deep breathing for 5 minutes to reduce stress.',
    'Include colorful vegetables in every meal for better nutrition.',
    'Aim for 7-8 hours of quality sleep each night.',
    'Stretch for 5 minutes every morning to improve flexibility.',
    'Limit screen time 1 hour before bed for better sleep.',
  ];

  useEffect(() => {
    setHealthTip(healthTips[Math.floor(Math.random() * healthTips.length)]);
    // Show onboarding if not completed
    if (profile && !profile.onboarding_complete) {
      setShowOnboarding(true);
    }
    fetchVitals();
  }, [profile]);

  const fetchVitals = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('vitals_log')
      .select('*')
      .eq('user_id', user.id)
      .order('log_date', { ascending: true })
      .limit(7);

    if (error) {
      console.error('Error fetching vitals:', error);
      return;
    }

    setVitals(data || []);
  };

  const handleOnboardingComplete = async () => {
    setShowOnboarding(false);
    await refreshProfile();
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Underweight', color: 'bg-blue-100 text-blue-700' };
    if (bmi < 25) return { label: 'Normal', color: 'bg-green-100 text-green-700' };
    if (bmi < 30) return { label: 'Overweight', color: 'bg-yellow-100 text-yellow-700' };
    return { label: 'Obese', color: 'bg-red-100 text-red-700' };
  };

  const getActivityLabel = (level: string) => {
    const labels: Record<string, string> = {
      sedentary: 'Sedentary',
      lightly_active: 'Lightly Active',
      moderately_active: 'Moderately Active',
      very_active: 'Very Active',
    };
    return labels[level] || level;
  };

  const getHealthGoalLabel = (goal: string) => {
    const goals: Record<string, string> = {
      lose_weight: 'Lose Weight',
      gain_muscle: 'Gain Muscle',
      manage_condition: 'Manage Condition',
      general_wellness: 'General Wellness',
      mental_health: 'Mental Health',
      monitor_vitals: 'Monitor Vitals',
    };
    return goals[goal] || goal;
  };

  const chartData = vitals.map(v => ({
    date: format(new Date(v.log_date), 'MMM dd'),
    bp: v.bp_systolic,
    sugar: v.blood_sugar,
    heartRate: v.heart_rate,
    weight: v.weight_kg,
  }));

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const bmiCategory = profile.bmi ? getBMICategory(profile.bmi) : null;

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {profile.full_name?.split(' ')[0]} 👋
            </h1>
            <p className="text-gray-500 mt-1">
              {format(new Date(), 'EEEE, MMMM do, yyyy')}
            </p>
            <div className="flex items-center gap-2 mt-3 text-sm text-green-700 bg-green-50 p-3 rounded-lg max-w-xl">
              <span className="text-lg">💡</span>
              <span className="font-medium">Health Tip:</span>
              <span>{healthTip}</span>
            </div>
          </div>
        </div>

        {/* Health Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* BMI Card */}
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">BMI</p>
                  <p className="text-2xl font-bold text-gray-900">{profile.bmi || '--'}</p>
                  {bmiCategory && (
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${bmiCategory.color}`}>
                      {bmiCategory.label}
                    </span>
                  )}
                </div>
                <div className="p-3 bg-green-100 rounded-xl">
                  <Activity className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Age & Blood Group Card */}
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Age & Blood Group</p>
                  <p className="text-2xl font-bold text-gray-900">{profile.age || '--'} yrs</p>
                  <p className="text-sm font-medium text-gray-600">{profile.blood_group}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Level Card */}
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Activity Level</p>
                  <p className="text-lg font-bold text-gray-900">
                    {getActivityLabel(profile.activity_level)}
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Health Goal Card */}
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Primary Goal</p>
                  <p className="text-lg font-bold text-gray-900">
                    {getHealthGoalLabel(profile.health_goal)}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Target className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Health Vitals Tracker */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg font-semibold">Health Vitals Tracker</CardTitle>
              <CardDescription>Monitor your daily health metrics</CardDescription>
            </div>
            <Button 
              onClick={() => setShowVitalsModal(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Log Today's Vitals
            </Button>
          </CardHeader>
          <CardContent>
            {vitals.length > 0 ? (
              <div className="space-y-6">
                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Blood Pressure Chart */}
                  <div className="h-64">
                    <h4 className="text-sm font-medium mb-2">Blood Pressure (7 days)</h4>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="bp" stroke="#ef4444" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Blood Sugar Chart */}
                  <div className="h-64">
                    <h4 className="text-sm font-medium mb-2">Blood Sugar (mg/dL)</h4>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="sugar" stroke="#3b82f6" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Latest Vitals Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {vitals.length > 0 && (
                    <>
                      <div className="p-4 bg-red-50 rounded-xl">
                        <p className="text-xs text-red-600 font-medium">Latest BP</p>
                        <p className="text-xl font-bold text-red-700">
                          {vitals[vitals.length - 1].bp_systolic}/{vitals[vitals.length - 1].bp_diastolic}
                        </p>
                        <p className="text-xs text-red-500">mmHg</p>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-xl">
                        <p className="text-xs text-blue-600 font-medium">Blood Sugar</p>
                        <p className="text-xl font-bold text-blue-700">
                          {vitals[vitals.length - 1].blood_sugar || '--'}
                        </p>
                        <p className="text-xs text-blue-500">mg/dL</p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-xl">
                        <p className="text-xs text-green-600 font-medium">Heart Rate</p>
                        <p className="text-xl font-bold text-green-700">
                          {vitals[vitals.length - 1].heart_rate || '--'}
                        </p>
                        <p className="text-xs text-green-500">bpm</p>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-xl">
                        <p className="text-xs text-purple-600 font-medium">Sleep</p>
                        <p className="text-xl font-bold text-purple-700">
                          {vitals[vitals.length - 1].sleep_hours || '--'}
                        </p>
                        <p className="text-xs text-purple-500">hours</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No vitals logged yet</p>
                <p className="text-sm text-gray-400 mb-4">Start tracking your health today</p>
                <Button 
                  onClick={() => setShowVitalsModal(true)}
                  variant="outline"
                >
                  Log Your First Entry
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
            <Settings className="h-5 w-5" />
            <span className="text-sm">Edit Profile</span>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
            <FileText className="h-5 w-5" />
            <span className="text-sm">Health Report</span>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
            <Bell className="h-5 w-5" />
            <span className="text-sm">Reminders</span>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
            <MapPin className="h-5 w-5" />
            <span className="text-sm">Find Clinic</span>
          </Button>
        </div>
      </div>

      {showVitalsModal && (
        <VitalsModal 
          onClose={() => setShowVitalsModal(false)} 
          onSave={fetchVitals}
        />
      )}

      {showOnboarding && user && (
        <OnboardingModal 
          userId={user.id}
          onComplete={handleOnboardingComplete}
        />
      )}
    </DashboardLayout>
  );
}
