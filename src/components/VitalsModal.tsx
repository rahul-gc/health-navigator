import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface VitalsModalProps {
  onClose: () => void;
  onSave: () => void;
}

export default function VitalsModal({ onClose, onSave }: VitalsModalProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [vitals, setVitals] = useState({
    bp_systolic: '',
    bp_diastolic: '',
    blood_sugar: '',
    heart_rate: '',
    weight_kg: '',
    sleep_hours: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('vitals_log')
        .upsert({
          user_id: user.id,
          log_date: format(new Date(), 'yyyy-MM-dd'),
          bp_systolic: vitals.bp_systolic ? parseInt(vitals.bp_systolic) : null,
          bp_diastolic: vitals.bp_diastolic ? parseInt(vitals.bp_diastolic) : null,
          blood_sugar: vitals.blood_sugar ? parseFloat(vitals.blood_sugar) : null,
          heart_rate: vitals.heart_rate ? parseInt(vitals.heart_rate) : null,
          weight_kg: vitals.weight_kg ? parseFloat(vitals.weight_kg) : null,
          sleep_hours: vitals.sleep_hours ? parseFloat(vitals.sleep_hours) : null,
          notes: vitals.notes || null,
        }, {
          onConflict: 'user_id,log_date'
        });

      if (error) throw error;

      toast({
        title: 'Vitals Logged',
        description: 'Your health vitals have been saved successfully.',
      });

      onSave();
      onClose();
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md border-0 shadow-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Activity className="h-5 w-5 text-green-600" />
            </div>
            <CardTitle className="text-lg">Log Today's Vitals</CardTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Blood Pressure */}
            <div className="space-y-2">
              <Label>Blood Pressure (mmHg)</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Systolic"
                  value={vitals.bp_systolic}
                  onChange={(e) => setVitals({ ...vitals, bp_systolic: e.target.value })}
                  className="h-11"
                />
                <span className="text-gray-400">/</span>
                <Input
                  type="number"
                  placeholder="Diastolic"
                  value={vitals.bp_diastolic}
                  onChange={(e) => setVitals({ ...vitals, bp_diastolic: e.target.value })}
                  className="h-11"
                />
              </div>
            </div>

            {/* Blood Sugar & Heart Rate */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bloodSugar">Blood Sugar (mg/dL)</Label>
                <Input
                  id="bloodSugar"
                  type="number"
                  placeholder="100"
                  value={vitals.blood_sugar}
                  onChange={(e) => setVitals({ ...vitals, blood_sugar: e.target.value })}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
                <Input
                  id="heartRate"
                  type="number"
                  placeholder="72"
                  value={vitals.heart_rate}
                  onChange={(e) => setVitals({ ...vitals, heart_rate: e.target.value })}
                  className="h-11"
                />
              </div>
            </div>

            {/* Weight & Sleep */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  placeholder="70.5"
                  value={vitals.weight_kg}
                  onChange={(e) => setVitals({ ...vitals, weight_kg: e.target.value })}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sleep">Sleep (hours)</Label>
                <Input
                  id="sleep"
                  type="number"
                  step="0.5"
                  placeholder="7.5"
                  value={vitals.sleep_hours}
                  onChange={(e) => setVitals({ ...vitals, sleep_hours: e.target.value })}
                  className="h-11"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <textarea
                id="notes"
                rows={3}
                placeholder="Any additional notes about your health today..."
                value={vitals.notes}
                onChange={(e) => setVitals({ ...vitals, notes: e.target.value })}
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-green-600 hover:bg-green-700"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Vitals'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
