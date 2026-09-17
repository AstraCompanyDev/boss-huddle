import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type MediaPost = {
  id: string;
  type: string;
  placement: string;
  title: string;
  category: string;
  excerpt: string | null;
  body: string | null;
  author: string | null;
  read_time: string | null;
  image_url: string | null;
  video_url: string | null;
  external_url: string | null;
  duration: string | null;
  status: string;
  sort_order: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export const PLACEMENTS = [
  { value: "lead", label: "Top story", hint: "The big headline at the top of the page" },
  { value: "secondary", label: "Side story", hint: "Small stories beside the top story" },
  { value: "feed", label: "Latest carousel", hint: "The scrolling row of recent stories" },
  { value: "interview", label: "Founder interviews", hint: "The interviews section" },
  { value: "video", label: "Video hub", hint: "The dark video section" },
  { value: "most_read", label: "Most read list", hint: "The numbered list in the sidebar" },
] as const;

export const POST_TYPES = [
  { value: "article", label: "Blog / article" },
  { value: "video", label: "Video" },
  { value: "image", label: "Image / photo story" },
] as const;

export function timeAgo(iso: string | null) {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 60) return `${Math.max(mins, 1)}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

/** Published posts for the public Media page, grouped by placement. */
export function usePublishedMedia() {
  const [posts, setPosts] = useState<MediaPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase
        .from("media_posts")
        .select("*")
        .eq("status", "published")
        .order("sort_order", { ascending: true })
        .order("published_at", { ascending: false, nullsFirst: false });
      if (!active) return;
      setPosts((data as MediaPost[]) ?? []);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  const byPlacement = (placement: string) => posts.filter((p) => p.placement === placement);

  return { posts, loading, byPlacement };
}
