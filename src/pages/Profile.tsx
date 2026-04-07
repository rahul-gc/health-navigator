import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { 
  User, 
  Activity, 
  Target, 
  Pill,
  AlertCircle,
  Save,
  Edit3,
  Camera
} from 'lucide-react';

export default function Profile() {
  const { profile, refreshProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    age: profile?.age || '',
    gender: profile?.gender || '',
    height_cm: profile?.height_cm || '',
    weight_kg: profile?.weight_kg || '',
    blood_group: profile?.blood_group || '',
    conditions: profile?.conditions?.join(', ') || '',
    medications: profile?.medications || '',
    allergies: profile?.allergies || '',
    smoker: profile?.smoker || 'no',
    drinker: profile?.drinker || 'no',
    activity_level: profile?.activity_level || '',
    health_goal: profile?.health_goal || '',
  });

  const handleSave = async () => {
    if (!profile?.user_id) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          age: formData.age ? parseInt(formData.age as string) : null,
          gender: formData.gender,
          height_cm: formData.height_cm ? parseFloat(formData.height_cm as string) : null,
          weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg as string) : null,
          blood_group: formData.blood_group,
          conditions: formData.conditions ? formData.conditions.split(',').map(c => c.trim()).filter(Boolean) : null,
          medications: formData.medications || null,
          allergies: formData.allergies || null,
          smoker: formData.smoker,
          drinker: formData.drinker,
          activity_level: formData.activity_level,
          health_goal: formData.health_goal,
        })
        .eq('user_id', profile.user_id);

      if (error) throw error;

      await refreshProfile();
      setEditing(false);
      
      toast({
        title: 'Profile Updated',
        description: 'Your health profile has been updated successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const getActivityLabel = (level: string) => {
    const labels: Record<string, string> = {
      sedentary: 'Sedentary (Little to no exercise)',
      lightly_active: 'Lightly Active (1-3 days/week)',
      moderately_active: 'Moderately Active (3-5 days/week)',
      very_active: 'Very Active (6-7 days/week)',
    };
    return labels[level] || level;
  };

  const getHealthGoalLabel = (goal: string) => {
    const goals: Record<string, string> = {
      lose_weight: 'Lose Weight',
      gain_muscle: 'Gain Muscle',
      manage_condition: 'Manage Health Condition',
      general_wellness: 'General Wellness',
      mental_health: 'Mental Health & Stress Relief',
      monitor_vitals: 'Monitor Vitals Regularly',
    };
    return goals[goal] || goal;
  };

  return (
    <DashboardLayout title="My Profile">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Health Profile</h1>
            <p className="text-gray-500">View and manage your personal health information</p>
          </div>
          <Button 
            onClick={() => editing ? handleSave() : setEditing(true)}
            disabled={saving}
            className={editing ? "bg-green-600 hover:bg-green-700 gap-2" : "gap-2"}
          >
            {editing ? (
              <>
                <Save className="h-4 w-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </>
            ) : (
              <>
                <Edit3 className="h-4 w-4" />
                Edit Profile
              </>
            )}
          </Button>
        </div>

        {/* Profile Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-semibold text-gray-900">{profile?.full_name || 'Not set'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-xl">
                  <Activity className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">BMI</p>
                  <p className="font-semibold text-gray-900">{profile?.bmi || '--'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Target className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Health Goal</p>
                  <p className="font-semibold text-gray-900">{getHealthGoalLabel(profile?.health_goal || '')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Personal Information */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Personal Information</CardTitle>
            <CardDescription>Your basic health details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                {editing ? (
                  <Input 
                    value={formData.full_name}
                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  />
                ) : (
                  <p className="text-gray-900 p-2 bg-gray-50 rounded-lg">{profile?.full_name || 'Not set'}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Age</Label>
                {editing ? (
                  <Input 
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                  />
                ) : (
                  <p className="text-gray-900 p-2 bg-gray-50 rounded-lg">{profile?.age ? `${profile.age} years` : 'Not set'}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Gender</Label>
                {editing ? (
                  <select 
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                ) : (
                  <p className="text-gray-900 p-2 bg-gray-50 rounded-lg capitalize">{profile?.gender || 'Not set'}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Blood Group</Label>
                {editing ? (
                  <select 
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    value={formData.blood_group}
                    onChange={(e) => setFormData({...formData, blood_group: e.target.value})}
                  >
                    <option value="">Select blood group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                ) : (
                  <p className="text-gray-900 p-2 bg-gray-50 rounded-lg">{profile?.blood_group || 'Not set'}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Height (cm)</Label>
                {editing ? (
                  <Input 
                    type="number"
                    value={formData.height_cm}
                    onChange={(e) => setFormData({...formData, height_cm: e.target.value})}
                  />
                ) : (
                  <p className="text-gray-900 p-2 bg-gray-50 rounded-lg">{profile?.height_cm ? `${profile.height_cm} cm` : 'Not set'}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Weight (kg)</Label>
                {editing ? (
                  <Input 
                    type="number"
                    value={formData.weight_kg}
                    onChange={(e) => setFormData({...formData, weight_kg: e.target.value})}
                  />
                ) : (
                  <p className="text-gray-900 p-2 bg-gray-50 rounded-lg">{profile?.weight_kg ? `${profile.weight_kg} kg` : 'Not set'}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Health Background */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Pill className="h-5 w-5 text-orange-500" />
              Health Background
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Chronic Conditions (comma separated)</Label>
                {editing ? (
                  <Input 
                    value={formData.conditions}
                    onChange={(e) => setFormData({...formData, conditions: e.target.value})}
                    placeholder="e.g., Diabetes, Hypertension"
                  />
                ) : (
                  <p className="text-gray-900 p-2 bg-gray-50 rounded-lg">
                    {profile?.conditions?.length ? profile.conditions.join(', ') : 'None reported'}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Current Medications</Label>
                {editing ? (
                  <Input 
                    value={formData.medications}
                    onChange={(e) => setFormData({...formData, medications: e.target.value})}
                    placeholder="e.g., Metformin, Lisinopril"
                  />
                ) : (
                  <p className="text-gray-900 p-2 bg-gray-50 rounded-lg">{profile?.medications || 'None reported'}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Allergies</Label>
                {editing ? (
                  <Input 
                    value={formData.allergies}
                    onChange={(e) => setFormData({...formData, allergies: e.target.value})}
                    placeholder="e.g., Penicillin, Peanuts"
                  />
                ) : (
                  <p className="text-gray-900 p-2 bg-gray-50 rounded-lg">{profile?.allergies || 'None reported'}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Activity Level</Label>
                {editing ? (
                  <select 
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    value={formData.activity_level}
                    onChange={(e) => setFormData({...formData, activity_level: e.target.value})}
                  >
                    <option value="">Select activity level</option>
                    <option value="sedentary">Sedentary</option>
                    <option value="lightly_active">Lightly Active</option>
                    <option value="moderately_active">Moderately Active</option>
                    <option value="very_active">Very Active</option>
                  </select>
                ) : (
                  <p className="text-gray-900 p-2 bg-gray-50 rounded-lg">{getActivityLabel(profile?.activity_level || '')}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Smoking Status</Label>
                {editing ? (
                  <select 
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    value={formData.smoker}
                    onChange={(e) => setFormData({...formData, smoker: e.target.value})}
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                    <option value="occasionally">Occasionally</option>
                  </select>
                ) : (
                  <p className="text-gray-900 p-2 bg-gray-50 rounded-lg capitalize">{profile?.smoker || 'Not set'}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Alcohol Consumption</Label>
                {editing ? (
                  <select 
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    value={formData.drinker}
                    onChange={(e) => setFormData({...formData, drinker: e.target.value})}
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                    <option value="occasionally">Occasionally</option>
                  </select>
                ) : (
                  <p className="text-gray-900 p-2 bg-gray-50 rounded-lg capitalize">{profile?.drinker || 'Not set'}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Health Goals */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-500" />
              Health Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>Primary Health Goal</Label>
              {editing ? (
                <select 
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  value={formData.health_goal}
                  onChange={(e) => setFormData({...formData, health_goal: e.target.value})}
                >
                  <option value="">Select goal</option>
                  <option value="lose_weight">Lose Weight</option>
                  <option value="gain_muscle">Gain Muscle</option>
                  <option value="manage_condition">Manage Health Condition</option>
                  <option value="general_wellness">General Wellness</option>
                  <option value="mental_health">Mental Health & Stress Relief</option>
                  <option value="monitor_vitals">Monitor Vitals Regularly</option>
                </select>
              ) : (
                <p className="text-gray-900 p-2 bg-gray-50 rounded-lg">{getHealthGoalLabel(profile?.health_goal || '')}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Important Notice */}
        <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
          <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-amber-800">Important Notice</p>
            <p className="text-sm text-amber-700">
              Keep your health information up to date for accurate AI guidance. 
              This information is private and only used to personalize your health recommendations.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
