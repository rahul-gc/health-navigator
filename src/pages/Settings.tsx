import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Bell, 
  Moon, 
  Globe, 
  Shield, 
  Smartphone,
  Mail,
  Trash2,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';

export default function Settings() {
  const { signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  
  const [notifications, setNotifications] = useState({
    dailyReminders: true,
    vitalAlerts: true,
    healthTips: true,
    emailNotifications: false,
    smsNotifications: false,
  });

  const [preferences, setPreferences] = useState({
    darkMode: false,
    compactView: false,
  });

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
    window.location.href = '/auth';
  };

  return (
    <DashboardLayout title="Settings">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500">Manage your app preferences and account settings</p>
        </div>

        {/* Notifications */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-500" />
              Notifications
            </CardTitle>
            <CardDescription>Control how and when you receive alerts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="font-medium">Daily Health Reminders</Label>
                <p className="text-sm text-gray-500">Get reminded to log your vitals daily</p>
              </div>
              <Switch 
                checked={notifications.dailyReminders}
                onCheckedChange={(checked) => setNotifications({...notifications, dailyReminders: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="font-medium">Vital Alerts</Label>
                <p className="text-sm text-gray-500">Notify when vitals are outside normal range</p>
              </div>
              <Switch 
                checked={notifications.vitalAlerts}
                onCheckedChange={(checked) => setNotifications({...notifications, vitalAlerts: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="font-medium">Health Tips</Label>
                <p className="text-sm text-gray-500">Receive personalized health tips</p>
              </div>
              <Switch 
                checked={notifications.healthTips}
                onCheckedChange={(checked) => setNotifications({...notifications, healthTips: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="font-medium">Email Notifications</Label>
                <p className="text-sm text-gray-500">Send health reports and alerts via email</p>
              </div>
              <Switch 
                checked={notifications.emailNotifications}
                onCheckedChange={(checked) => setNotifications({...notifications, emailNotifications: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="font-medium">SMS Notifications</Label>
                <p className="text-sm text-gray-500">Receive important alerts via SMS</p>
              </div>
              <Switch 
                checked={notifications.smsNotifications}
                onCheckedChange={(checked) => setNotifications({...notifications, smsNotifications: checked})}
              />
            </div>
          </CardContent>
        </Card>

        {/* Language */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Globe className="h-5 w-5 text-green-500" />
              Language & Region
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>App Language</Label>
              <select 
                className="w-full max-w-xs h-10 px-3 rounded-md border border-input bg-background"
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'en' | 'ne' | 'hi')}
              >
                <option value="en">English</option>
                <option value="ne">नेपाली (Nepali)</option>
                <option value="hi">हिन्दी (Hindi)</option>
              </select>
              <p className="text-sm text-gray-500">
                Change the language used throughout the app interface
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Moon className="h-5 w-5 text-purple-500" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="font-medium">Dark Mode</Label>
                <p className="text-sm text-gray-500">Use dark theme throughout the app</p>
              </div>
              <Switch 
                checked={preferences.darkMode}
                onCheckedChange={(checked) => setPreferences({...preferences, darkMode: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="font-medium">Compact View</Label>
                <p className="text-sm text-gray-500">Show more content with less spacing</p>
              </div>
              <Switch 
                checked={preferences.compactView}
                onCheckedChange={(checked) => setPreferences({...preferences, compactView: checked})}
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Shield className="h-5 w-5 text-red-500" />
              Privacy & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg">
                  <Shield className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium">Data Privacy</p>
                  <p className="text-sm text-gray-500">Manage how your health data is used</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg">
                  <Smartphone className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium">Connected Devices</p>
                  <p className="text-sm text-gray-500">Manage linked health devices</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg">
                  <Mail className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium">Export Data</p>
                  <p className="text-sm text-gray-500">Download your health data</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card className="border-0 shadow-sm border-red-100">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-red-600">Account Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2 text-red-600 border-red-200 hover:bg-red-50"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>

            <Button 
              variant="outline" 
              className="w-full justify-start gap-2 text-red-600 border-red-200 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              Delete Account
            </Button>
          </CardContent>
        </Card>

        {/* App Info */}
        <div className="text-center text-sm text-gray-500 pt-4">
          <p>Health Sathi v1.0.0</p>
          <p className="mt-1">Your Personal Health Companion</p>
          <p className="mt-2 text-xs">
            <a href="#" className="text-green-600 hover:underline">Privacy Policy</a>
            {' • '}
            <a href="#" className="text-green-600 hover:underline">Terms of Service</a>
            {' • '}
            <a href="#" className="text-green-600 hover:underline">Help Center</a>
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
