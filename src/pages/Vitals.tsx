import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Activity, 
  TrendingUp, 
  Calendar,
  Plus,
  FileText,
  Download,
  Heart,
  Droplets,
  Moon,
  Thermometer
} from 'lucide-react';
import { format, subDays } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import VitalsModal from '@/components/VitalsModal';

interface VitalsLog {
  id: string;
  log_date: string;
  bp_systolic: number;
  bp_diastolic: number;
  blood_sugar: number;
  heart_rate: number;
  weight_kg: number;
  sleep_hours: number;
  notes: string;
}

export default function Vitals() {
  const { user, profile } = useAuth();
  const [vitals, setVitals] = useState<VitalsLog[]>([]);
  const [showVitalsModal, setShowVitalsModal] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchVitals();
  }, []);

  const fetchVitals = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('vitals_log')
      .select('*')
      .eq('user_id', user.id)
      .order('log_date', { ascending: true })
      .limit(30);

    if (error) {
      console.error('Error fetching vitals:', error);
      return;
    }

    setVitals(data || []);
  };

  const chartData = vitals.map(v => ({
    date: format(new Date(v.log_date), 'MMM dd'),
    bp: v.bp_systolic,
    sugar: v.blood_sugar,
    heartRate: v.heart_rate,
    weight: v.weight_kg,
    sleep: v.sleep_hours,
  }));

  const latestVitals = vitals.length > 0 ? vitals[vitals.length - 1] : null;

  const getBPCategory = (sys: number, dia: number) => {
    if (sys < 120 && dia < 80) return { label: 'Normal', color: 'text-green-600', bg: 'bg-green-50' };
    if (sys < 130 && dia < 80) return { label: 'Elevated', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    if (sys < 140 || dia < 90) return { label: 'Stage 1', color: 'text-orange-600', bg: 'bg-orange-50' };
    return { label: 'Stage 2', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const getHeartRateCategory = (hr: number) => {
    if (hr < 60) return { label: 'Low', color: 'text-yellow-600' };
    if (hr <= 100) return { label: 'Normal', color: 'text-green-600' };
    return { label: 'High', color: 'text-red-600' };
  };

  const bpCategory = latestVitals ? getBPCategory(latestVitals.bp_systolic, latestVitals.bp_diastolic) : null;
  const hrCategory = latestVitals ? getHeartRateCategory(latestVitals.heart_rate) : null;

  return (
    <DashboardLayout title="Health Vitals">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Health Vitals Tracker</h1>
            <p className="text-gray-500">Monitor and track your daily health metrics</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export Data
            </Button>
            <Button 
              onClick={() => setShowVitalsModal(true)}
              className="bg-green-600 hover:bg-green-700 gap-2"
            >
              <Plus className="h-4 w-4" />
              Log Today's Vitals
            </Button>
          </div>
        </div>

        {/* Latest Vitals Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Blood Pressure</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {latestVitals ? `${latestVitals.bp_systolic}/${latestVitals.bp_diastolic}` : '--/--'}
                  </p>
                  {bpCategory && (
                    <span className={`text-xs font-medium ${bpCategory.color}`}>
                      {bpCategory.label}
                    </span>
                  )}
                </div>
                <div className={`p-3 rounded-xl ${bpCategory?.bg || 'bg-gray-100'}`}>
                  <Heart className="h-6 w-6 text-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Heart Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {latestVitals?.heart_rate || '--'} <span className="text-sm font-normal text-gray-500">bpm</span>
                  </p>
                  {hrCategory && (
                    <span className={`text-xs font-medium ${hrCategory.color}`}>
                      {hrCategory.label}
                    </span>
                  )}
                </div>
                <div className="p-3 bg-green-100 rounded-xl">
                  <Activity className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Blood Sugar</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {latestVitals?.blood_sugar || '--'} <span className="text-sm font-normal text-gray-500">mg/dL</span>
                  </p>
                  <span className="text-xs text-gray-500">
                    Fasting: 70-100 normal
                  </span>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Droplets className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Sleep Duration</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {latestVitals?.sleep_hours || '--'} <span className="text-sm font-normal text-gray-500">hrs</span>
                  </p>
                  <span className="text-xs text-gray-500">
                    Goal: 7-8 hours
                  </span>
                </div>
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Moon className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Blood Pressure Chart */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Blood Pressure Trend (30 days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="bp" stroke="#ef4444" name="Systolic" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Blood Sugar Chart */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Droplets className="h-5 w-5 text-blue-500" />
                Blood Sugar Trend (30 days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="sugar" stroke="#3b82f6" name="Blood Sugar (mg/dL)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Heart Rate Chart */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-500" />
                Heart Rate Trend (30 days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="heartRate" stroke="#22c55e" name="Heart Rate (bpm)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Weight Chart */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-orange-500" />
                Weight Trend (30 days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="weight" stroke="#f97316" name="Weight (kg)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Logs Table */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Recent Vitals Logs</CardTitle>
          </CardHeader>
          <CardContent>
            {vitals.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">BP (mmHg)</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Heart Rate</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Blood Sugar</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Weight</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Sleep</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...vitals].reverse().slice(0, 10).map((vital) => (
                      <tr key={vital.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">{format(new Date(vital.log_date), 'MMM dd, yyyy')}</td>
                        <td className="py-3 px-4">{vital.bp_systolic}/{vital.bp_diastolic}</td>
                        <td className="py-3 px-4">{vital.heart_rate} bpm</td>
                        <td className="py-3 px-4">{vital.blood_sugar} mg/dL</td>
                        <td className="py-3 px-4">{vital.weight_kg} kg</td>
                        <td className="py-3 px-4">{vital.sleep_hours} hrs</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No vitals logged yet</p>
                <p className="text-sm text-gray-400 mb-4">Start tracking your health today</p>
                <Button 
                  onClick={() => setShowVitalsModal(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Log Your First Entry
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {showVitalsModal && (
        <VitalsModal 
          onClose={() => setShowVitalsModal(false)} 
          onSave={fetchVitals}
        />
      )}
    </DashboardLayout>
  );
}
