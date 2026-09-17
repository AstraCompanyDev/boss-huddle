CREATE TABLE public.media_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL DEFAULT 'article',
  placement text NOT NULL DEFAULT 'feed',
  title text NOT NULL,
  category text NOT NULL DEFAULT 'Founders',
  excerpt text,
  body text,
  author text,
  read_time text,
  image_url text,
  video_url text,
  external_url text,
  duration text,
  status text NOT NULL DEFAULT 'draft',
  sort_order integer NOT NULL DEFAULT 0,
  published_at timestamptz,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.media_posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.media_posts TO authenticated;
GRANT ALL ON public.media_posts TO service_role;

ALTER TABLE public.media_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published media is viewable by everyone"
ON public.media_posts FOR SELECT
USING (status = 'published' OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert media"
ON public.media_posts FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update media"
ON public.media_posts FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete media"
ON public.media_posts FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_media_posts_updated_at
BEFORE UPDATE ON public.media_posts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX media_posts_placement_idx ON public.media_posts (placement, status, sort_order, published_at DESC);