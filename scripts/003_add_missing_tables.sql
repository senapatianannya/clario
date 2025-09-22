-- Add missing columns to interviews table for evaluation results
ALTER TABLE public.interviews 
ADD COLUMN IF NOT EXISTS technical_score INTEGER CHECK (technical_score >= 0 AND technical_score <= 100),
ADD COLUMN IF NOT EXISTS communication_score INTEGER CHECK (communication_score >= 0 AND communication_score <= 100),
ADD COLUMN IF NOT EXISTS problem_solving_score INTEGER CHECK (problem_solving_score >= 0 AND problem_solving_score <= 100),
ADD COLUMN IF NOT EXISTS cultural_fit_score INTEGER CHECK (cultural_fit_score >= 0 AND cultural_fit_score <= 100),
ADD COLUMN IF NOT EXISTS strengths JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS areas_for_improvement JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS detailed_feedback TEXT,
ADD COLUMN IF NOT EXISTS recommendations JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE;

-- Update status check constraint to include 'ready' status
ALTER TABLE public.interviews DROP CONSTRAINT IF EXISTS interviews_status_check;
ALTER TABLE public.interviews ADD CONSTRAINT interviews_status_check 
CHECK (status IN ('draft', 'ready', 'in_progress', 'completed'));

-- Create interview_questions table
CREATE TABLE IF NOT EXISTS public.interview_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  interview_id UUID NOT NULL REFERENCES public.interviews(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  category TEXT CHECK (category IN ('technical', 'behavioral', 'situational', 'company_specific')) NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')) NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  expected_answer TEXT,
  follow_up_questions JSONB DEFAULT '[]',
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

CREATE POLICY "questions_update_own" ON public.interview_questions 
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.interviews 
    WHERE interviews.id = interview_questions.interview_id 
    AND interviews.user_id = auth.uid()
  )
);

CREATE POLICY "questions_delete_own" ON public.interview_questions 
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.interviews 
    WHERE interviews.id = interview_questions.interview_id 
    AND interviews.user_id = auth.uid()
  )
);

-- Create interview_responses table
CREATE TABLE IF NOT EXISTS public.interview_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  interview_id UUID NOT NULL REFERENCES public.interviews(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.interview_questions(id) ON DELETE CASCADE,
  response_text TEXT NOT NULL,
  response_time_seconds INTEGER DEFAULT 0,
  audio_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(interview_id, question_id)
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

-- Create trigger for updated_at on interview_responses
CREATE TRIGGER update_responses_updated_at 
BEFORE UPDATE ON public.interview_responses 
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_interview_questions_interview_id ON public.interview_questions(interview_id);
CREATE INDEX IF NOT EXISTS idx_interview_questions_order ON public.interview_questions(interview_id, order_index);
CREATE INDEX IF NOT EXISTS idx_interview_responses_interview_id ON public.interview_responses(interview_id);
CREATE INDEX IF NOT EXISTS idx_interview_responses_question_id ON public.interview_responses(question_id);
