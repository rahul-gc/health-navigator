import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Heart, Activity, User, Target, ChevronRight, ChevronLeft } from 'lucide-react';

const conditions = [
  'Diabetes',
  'Hypertension',
  'Asthma',
  'Heart Disease',
  'Thyroid',
  'None',
  'Other',
];

const healthGoals = [
  { id: 'lose_weight', label: 'Lose Weight', icon: '🎯' },
  { id: 'gain_muscle', label: 'Gain Muscle', icon: '💪' },
  { id: 'manage_condition', label: 'Manage Condition', icon: '🏥' },
  { id: 'general_wellness', label: 'General Wellness', icon: '🌟' },
  { id: 'mental_health', label: 'Improve Mental Health', icon: '🧠' },
  { id: 'monitor_vitals', label: 'Monitor Vitals', icon: '📊' },
];

const reminderOptions = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'never', label: 'Never' },
];

export default function OnboardingModal({ userId, onComplete }: { userId: string; onComplete: () => void }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Step 1: Personal Info
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  // Step 2: Physical Stats
  const [heightCm, setHeightCm] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');

  // Step 3: Health Background
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [medications, setMedications] = useState('');
  const [allergies, setAllergies] = useState('');
  const [smoker, setSmoker] = useState('no');
  const [drinker, setDrinker] = useState('no');
  const [activityLevel, setActivityLevel] = useState('');

  // Step 4: Health Goals
  const [healthGoal, setHealthGoal] = useState('');
  const [reminderFreq, setReminderFreq] = useState('weekly');

  const calculateBMI = () => {
    const h = parseFloat(heightCm);
    const w = parseFloat(weightKg);
    if (h && w) {
      return (w / ((h / 100) ** 2)).toFixed(1);
    }
    return null;
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-500' };
    if (bmi < 25) return { label: 'Normal', color: 'text-green-500' };
    if (bmi < 30) return { label: 'Overweight', color: 'text-yellow-500' };
    return { label: 'Obese', color: 'text-red-500' };
  };

  const saveProfile = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          dob: dob || null,
          gender: gender || null,
          height_cm: heightCm ? parseFloat(heightCm) : null,
          weight_kg: weightKg ? parseFloat(weightKg) : null,
          blood_group: bloodGroup || 'unknown',
          conditions: selectedConditions.length > 0 ? selectedConditions : null,
          medications: medications || null,
          allergies: allergies || null,
          smoker: smoker,
          drinker: drinker,
          activity_level: activityLevel || null,
          health_goal: healthGoal || null,
          reminder_freq: reminderFreq,
          avatar_url: avatarUrl || null,
          onboarding_complete: true,
          onboarding_step: 4,
          preferred_language: 'en',
        })
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: 'Profile Complete!',
        description: 'Welcome to Health Sathi. Your personal health companion is ready.',
      });

      onComplete();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
    else saveProfile();
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name *</Label>
        <Input
          id="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Enter your full name"
          className="h-11"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="dob">Date of Birth</Label>
        <Input
          id="dob"
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          className="h-11"
        />
      </div>

      <div className="space-y-2">
        <Label>Gender</Label>
        <RadioGroup value={gender} onValueChange={setGender} className="flex flex-wrap gap-4">
          {['male', 'female', 'other', 'prefer_not_to_say'].map((g) => (
            <div key={g} className="flex items-center space-x-2">
              <RadioGroupItem value={g} id={g} />
              <Label htmlFor={g} className="capitalize cursor-pointer">
                {g.replace(/_/g, ' ')}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="height">Height (cm)</Label>
          <Input
            id="height"
            type="number"
            value={heightCm}
            onChange={(e) => setHeightCm(e.target.value)}
            placeholder="175"
            className="h-11"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input
            id="weight"
            type="number"
            value={weightKg}
            onChange={(e) => setWeightKg(e.target.value)}
            placeholder="70"
            className="h-11"
          />
        </div>
      </div>

      {calculateBMI() && (
        <div className="p-4 bg-green-50 rounded-xl border border-green-100">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Your BMI</p>
            <p className="text-3xl font-bold text-green-600">{calculateBMI()}</p>
            {(() => {
              const bmi = parseFloat(calculateBMI()!);
              const category = getBMICategory(bmi);
              return <p className={`text-sm font-medium ${category.color}`}>{category.label}</p>;
            })()}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="bloodGroup">Blood Group</Label>
        <select
          id="bloodGroup"
          value={bloodGroup}
          onChange={(e) => setBloodGroup(e.target.value)}
          className="w-full h-11 px-3 rounded-md border border-input bg-background text-sm"
        >
          <option value="">Select blood group</option>
          {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown'].map((bg) => (
            <option key={bg} value={bg}>{bg}</option>
          ))}
        </select>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Chronic Conditions (select all that apply)</Label>
        <div className="grid grid-cols-2 gap-2">
          {conditions.map((condition) => (
            <div key={condition} className="flex items-center space-x-2">
              <Checkbox
                id={condition}
                checked={selectedConditions.includes(condition)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedConditions([...selectedConditions, condition]);
                  } else {
                    setSelectedConditions(selectedConditions.filter((c) => c !== condition));
                  }
                }}
              />
              <Label htmlFor={condition} className="text-sm cursor-pointer">{condition}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="medications">Current Medications</Label>
        <Input
          id="medications"
          value={medications}
          onChange={(e) => setMedications(e.target.value)}
          placeholder="List any medications (optional)"
          className="h-11"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="allergies">Known Allergies</Label>
        <Input
          id="allergies"
          value={allergies}
          onChange={(e) => setAllergies(e.target.value)}
          placeholder="List any allergies (optional)"
          className="h-11"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Do you smoke?</Label>
          <RadioGroup value={smoker} onValueChange={setSmoker}>
            {['yes', 'no', 'occasionally'].map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`smoke-${option}`} />
                <Label htmlFor={`smoke-${option}`} className="capitalize cursor-pointer">{option}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label>Do you drink alcohol?</Label>
          <RadioGroup value={drinker} onValueChange={setDrinker}>
            {['yes', 'no', 'occasionally'].map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`drink-${option}`} />
                <Label htmlFor={`drink-${option}`} className="capitalize cursor-pointer">{option}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Physical Activity Level</Label>
        <RadioGroup value={activityLevel} onValueChange={setActivityLevel} className="space-y-2">
          {[
            { value: 'sedentary', label: 'Sedentary', desc: 'Little to no exercise' },
            { value: 'lightly_active', label: 'Lightly Active', desc: 'Light exercise 1-3 days/week' },
            { value: 'moderately_active', label: 'Moderately Active', desc: 'Moderate exercise 3-5 days/week' },
            { value: 'very_active', label: 'Very Active', desc: 'Hard exercise 6-7 days/week' },
          ].map((level) => (
            <div key={level.value} className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors">
              <RadioGroupItem value={level.value} id={level.value} className="mt-1" />
              <div className="flex-1">
                <Label htmlFor={level.value} className="font-medium cursor-pointer">{level.label}</Label>
                <p className="text-sm text-gray-500">{level.desc}</p>
              </div>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Primary Health Goal</Label>
        <div className="grid grid-cols-2 gap-3">
          {healthGoals.map((goal) => (
            <div
              key={goal.id}
              onClick={() => setHealthGoal(goal.id)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                healthGoal === goal.id
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-green-200'
              }`}
            >
              <div className="text-2xl mb-2">{goal.icon}</div>
              <p className="font-medium text-sm">{goal.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Health Check-in Reminders</Label>
        <RadioGroup value={reminderFreq} onValueChange={setReminderFreq} className="flex gap-4">
          {reminderOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={option.value} />
              <Label htmlFor={option.value} className="cursor-pointer">{option.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );

  const steps = [
    { num: 1, title: 'Personal Info', icon: User },
    { num: 2, title: 'Physical Stats', icon: Activity },
    { num: 3, title: 'Health Background', icon: Heart },
    { num: 4, title: 'Health Goals', icon: Target },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-lg border-0 shadow-2xl bg-white max-h-[90vh] overflow-y-auto">
        <CardHeader className="border-b pb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <Heart className="h-5 w-5 text-green-600" />
            </div>
            <span className="font-semibold text-gray-900">Health Sathi</span>
          </div>
          <CardTitle className="text-xl">Complete Your Profile</CardTitle>
          <CardDescription>
            Step {step} of 4: {steps[step - 1].title}
          </CardDescription>
          <Progress value={(step / 4) * 100} className="mt-2 h-2" />
        </CardHeader>

        <CardContent className="p-6">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={step === 1}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>

            <Button
              onClick={nextStep}
              disabled={loading || (step === 1 && !fullName)}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              {loading ? 'Saving...' : step === 4 ? 'Complete Setup' : 'Next'}
              {step !== 4 && <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
