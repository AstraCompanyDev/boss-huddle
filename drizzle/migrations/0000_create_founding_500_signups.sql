CREATE TABLE public.founding_500_signups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  business_bio TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT INSERT ON public.founding_500_signups TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.founding_500_signups TO authenticated;
GRANT ALL ON public.founding_500_signups TO service_role;

ALTER TABLE public.founding_500_signups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can sign up for Founding 500"
ON public.founding_500_signups
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Admins can view signups"
ON public.founding_500_signups
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete signups"
ON public.founding_500_signups
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));