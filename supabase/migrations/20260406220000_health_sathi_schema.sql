-- Migration: Extended profiles table for Health Sathi onboarding
-- Created: 2026-04-06

-- Add new columns to existing profiles table
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS full_name TEXT,
  ADD COLUMN IF NOT EXISTS dob DATE,
  ADD COLUMN IF NOT EXISTS age INTEGER,
  ADD COLUMN IF NOT EXISTS gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  ADD COLUMN IF NOT EXISTS height_cm NUMERIC(5,2),
  ADD COLUMN IF NOT EXISTS weight_kg NUMERIC(5,2),
  ADD COLUMN IF NOT EXISTS bmi NUMERIC(4,2),
  ADD COLUMN IF NOT EXISTS blood_group TEXT CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown')),
  ADD COLUMN IF NOT EXISTS conditions TEXT[],
  ADD COLUMN IF NOT EXISTS medications TEXT,
  ADD COLUMN IF NOT EXISTS allergies TEXT,
  ADD COLUMN IF NOT EXISTS smoker TEXT CHECK (smoker IN ('yes', 'no', 'occasionally')),
  ADD COLUMN IF NOT EXISTS drinker TEXT CHECK (drinker IN ('yes', 'no', 'occasionally')),
  ADD COLUMN IF NOT EXISTS activity_level TEXT CHECK (activity_level IN ('sedentary', 'lightly_active', 'moderately_active', 'very_active')),
  ADD COLUMN IF NOT EXISTS health_goal TEXT,
  ADD COLUMN IF NOT EXISTS reminder_freq TEXT CHECK (reminder_freq IN ('daily', 'weekly', 'never')),
  ADD COLUMN IF NOT EXISTS avatar_url TEXT,
  ADD COLUMN IF NOT EXISTS onboarding_complete BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS onboarding_step INTEGER DEFAULT 0;

-- Create vitals_log table for tracking health vitals
CREATE TABLE IF NOT EXISTS public.vitals_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  bp_systolic INTEGER,
  bp_diastolic INTEGER,
  blood_sugar NUMERIC(5,2),
  heart_rate INTEGER,
  weight_kg NUMERIC(5,2),
  sleep_hours NUMERIC(3,1),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, log_date)
);

-- Enable RLS on vitals_log
ALTER TABLE public.vitals_log ENABLE ROW LEVEL SECURITY;

-- RLS policies for vitals_log
CREATE POLICY "Users can view their own vitals" ON public.vitals_log FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own vitals" ON public.vitals_log FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own vitals" ON public.vitals_log FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own vitals" ON public.vitals_log FOR DELETE USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_vitals_log_user_date ON public.vitals_log(user_id, log_date DESC);

-- Function to auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger for vitals_log
DROP TRIGGER IF EXISTS update_vitals_log_updated_at ON public.vitals_log;
CREATE TRIGGER update_vitals_log_updated_at
  BEFORE UPDATE ON public.vitals_log
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to calculate BMI
CREATE OR REPLACE FUNCTION public.calculate_bmi(weight_kg NUMERIC, height_cm NUMERIC)
RETURNS NUMERIC AS $$
BEGIN
  IF weight_kg IS NULL OR height_cm IS NULL OR height_cm = 0 THEN
    RETURN NULL;
  END IF;
  RETURN ROUND(weight_kg / ((height_cm / 100) * (height_cm / 100)), 2);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to auto-calculate BMI on profile insert/update
CREATE OR REPLACE FUNCTION public.auto_calculate_bmi()
RETURNS TRIGGER AS $$
BEGIN
  NEW.bmi = public.calculate_bmi(NEW.weight_kg, NEW.height_cm);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for BMI calculation
DROP TRIGGER IF EXISTS calculate_profile_bmi ON public.profiles;
CREATE TRIGGER calculate_profile_bmi
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.auto_calculate_bmi();

-- Function to calculate age from DOB
CREATE OR REPLACE FUNCTION public.calculate_age(dob DATE)
RETURNS INTEGER AS $$
BEGIN
  IF dob IS NULL THEN
    RETURN NULL;
  END IF;
  RETURN EXTRACT(YEAR FROM AGE(dob));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to auto-calculate age on profile insert/update
CREATE OR REPLACE FUNCTION public.auto_calculate_age()
RETURNS TRIGGER AS $$
BEGIN
  NEW.age = public.calculate_age(NEW.dob);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for age calculation
DROP TRIGGER IF EXISTS calculate_profile_age ON public.profiles;
CREATE TRIGGER calculate_profile_age
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.auto_calculate_age();
