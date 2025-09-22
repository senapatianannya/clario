-- Add additional fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS experience_level TEXT;

-- Update interviews table to include detailed feedback fields
ALTER TABLE public.interviews 
ADD COLUMN IF NOT EXISTS technical_score INTEGER CHECK (technical_score >= 0 AND technical_score <= 100),
ADD COLUMN IF NOT EXISTS communication_score INTEGER CHECK (communication_score >= 0 AND communication_score <= 100),
ADD COLUMN IF NOT EXISTS problem_solving_score INTEGER CHECK (problem_solving_score >= 0 AND problem_solving_score <= 100),
ADD COLUMN IF NOT EXISTS cultural_fit_score INTEGER CHECK (cultural_fit_score >= 0 AND cultural_fit_score <= 100),
ADD COLUMN IF NOT EXISTS strengths TEXT[],
ADD COLUMN IF NOT EXISTS areas_for_improvement TEXT[],
ADD COLUMN IF NOT EXISTS detailed_feedback TEXT,
ADD COLUMN IF NOT EXISTS recommendations TEXT[],
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE;

-- Create interview_questions table for storing generated questions
CREATE TABLE IF NOT EXISTS public.interview_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  interview_id UUID NOT NULL REFERENCES public.interviews(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  category TEXT CHECK (category IN ('technical', 'behavioral', 'situational', 'company_specific')),
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  order_index INTEGER NOT NULL,
  expected_answer TEXT,
  follow_up_questions TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on interview_questions
ALTER TABLE public.interview_questions ENABLE ROW LEVEL SECURITY;

-- Create policies for interview_questions
CREATE POLICY "questions_select_own" ON public.interview_questions 
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.interviews 
    WHERE interviews.id = interview_questions.interview_id 
    AND interviews.user_id = auth.uid()
  )
);

CREATE POLICY "questions_insert_own" ON public.interview_questions 
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.interviews 
    WHERE interviews.id = interview_questions.interview_id 
    AND interviews.user_id = auth.uid()
  )
);

-- Create interview_responses table for storing user responses
CREATE TABLE IF NOT EXISTS public.interview_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  interview_id UUID NOT NULL REFERENCES public.interviews(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  response_text TEXT NOT NULL,
  response_time_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on interview_responses
ALTER TABLE public.interview_responses ENABLE ROW LEVEL SECURITY;

-- Create policies for interview_responses
CREATE POLICY "responses_select_own" ON public.interview_responses 
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.interviews 
    WHERE interviews.id = interview_responses.interview_id 
    AND interviews.user_id = auth.uid()
  )
);

CREATE POLICY "responses_insert_own" ON public.interview_responses 
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.interviews 
    WHERE interviews.id = interview_responses.interview_id 
    AND interviews.user_id = auth.uid()
  )
);

CREATE POLICY "responses_update_own" ON public.interview_responses 
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.interviews 
    WHERE interviews.id = interview_responses.interview_id 
    AND interviews.user_id = auth.uid()
  )
);

CREATE POLICY "responses_delete_own" ON public.interview_responses 
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.interviews 
    WHERE interviews.id = interview_responses.interview_id 
    AND interviews.user_id = auth.uid()
  )
);
