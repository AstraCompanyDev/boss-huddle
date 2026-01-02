-- Fix search_path for handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, created_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    NOW()
  );
  
  INSERT INTO public.team_members (user_id, join_date)
  VALUES (NEW.id, NOW());
  
  RETURN NEW;
END;
$$;

-- Fix search_path for update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Create files table to track user uploads
CREATE TABLE public.user_files (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    file_name TEXT NOT NULL,
    file_type TEXT,
    file_size BIGINT,
    file_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.user_files ENABLE ROW LEVEL SECURITY;

-- Users can view their own files
CREATE POLICY "Users can view own files"
ON public.user_files
FOR SELECT
USING (auth.uid() = user_id);

-- Users can upload files
CREATE POLICY "Users can upload files"
ON public.user_files
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can delete own files
CREATE POLICY "Users can delete own files"
ON public.user_files
FOR DELETE
USING (auth.uid() = user_id);

-- Admins can view all files
CREATE POLICY "Admins can view all files"
ON public.user_files
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));