import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  FileText,
  Image as ImageIcon,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  UploadCloud,
  Video as VideoIcon,
  ExternalLink,
} from "lucide-react";
import { MediaPost, PLACEMENTS, POST_TYPES, timeAgo } from "@/hooks/useMediaPosts";

const CATEGORIES = ["Funding", "Markets", "Founders", "Product", "Opinion", "Founder Interview"];

const TEN_YEARS = 60 * 60 * 24 * 365 * 10;

type FormState = {
  id?: string;
  type: string;
  placement: string;
  title: string;
  category: string;
  excerpt: string;
  body: string;
  author: string;
  read_time: string;
  duration: string;
  external_url: string;
  image_url: string;
  video_url: string;
  status: string;
  sort_order: number;
};

const emptyForm: FormState = {
  type: "article",
  placement: "feed",
  title: "",
  category: "Founders",
  excerpt: "",
  body: "",
  author: "",
  read_time: "",
  duration: "",
  external_url: "",
  image_url: "",
  video_url: "",
  status: "draft",
  sort_order: 0,
};

const typeIcon = (type: string) =>
  type === "video" ? VideoIcon : type === "image" ? ImageIcon : FileText;

export default function MediaStudio() {
  const { toast } = useToast();
  const [posts, setPosts] = useState<MediaPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("media_posts")
      .select("*")
      .order("updated_at", { ascending: false });
    if (error) {
      toast({ title: "Couldn't load your content", description: error.message, variant: "destructive" });
    } else {
      setPosts((data as MediaPost[]) ?? []);
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  const visible = useMemo(
    () => (filter === "all" ? posts : posts.filter((p) => p.type === filter)),
    [posts, filter]
  );

  const stats = useMemo(
    () => ({
      published: posts.filter((p) => p.status === "published").length,
      drafts: posts.filter((p) => p.status === "draft").length,
      total: posts.length,
    }),
    [posts]
  );

  const openNew = () => {
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (p: MediaPost) => {
    setForm({
      id: p.id,
      type: p.type,
      placement: p.placement,
      title: p.title,
      category: p.category,
      excerpt: p.excerpt ?? "",
      body: p.body ?? "",
      author: p.author ?? "",
      read_time: p.read_time ?? "",
      duration: p.duration ?? "",
      external_url: p.external_url ?? "",
      image_url: p.image_url ?? "",
      video_url: p.video_url ?? "",
      status: p.status,
      sort_order: p.sort_order,
    });
    setOpen(true);
  };

  const save = async () => {
    if (!form.title.trim()) {
      toast({ title: "Add a title first", variant: "destructive" });
      return;
    }
    setSaving(true);
    const { data: auth } = await supabase.auth.getUser();
    const payload = {
      type: form.type,
      placement: form.placement,
      title: form.title.trim(),
      category: form.category,
      excerpt: form.excerpt || null,
      body: form.body || null,
      author: form.author || null,
      read_time: form.read_time || null,
      duration: form.duration || null,
      external_url: form.external_url || null,
      image_url: form.image_url || null,
      video_url: form.video_url || null,
      status: form.status,
      sort_order: Number(form.sort_order) || 0,
      published_at:
        form.status === "published" ? new Date().toISOString() : null,
    };

    const { error } = form.id
      ? await supabase.from("media_posts").update(payload).eq("id", form.id)
      : await supabase
          .from("media_posts")
          .insert({ ...payload, created_by: auth.user?.id ?? null });

    setSaving(false);
    if (error) {
      toast({ title: "Couldn't save", description: error.message, variant: "destructive" });
      return;
    }
    toast({
      title: form.id ? "Changes saved" : "Post created",
      description:
        form.status === "published" ? "It's live on the Media page." : "Saved as a draft.",
    });
    setOpen(false);
    load();
  };

  const togglePublish = async (p: MediaPost) => {
    const next = p.status === "published" ? "draft" : "published";
    const { error } = await supabase
      .from("media_posts")
      .update({
        status: next,
        published_at: next === "published" ? new Date().toISOString() : null,
      })
      .eq("id", p.id);
    if (error) {
      toast({ title: "Couldn't update", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: next === "published" ? "Published" : "Moved to drafts" });
    load();
  };

  const remove = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from("media_posts").delete().eq("id", deleteId);
    setDeleteId(null);
    if (error) {
      toast({ title: "Couldn't delete", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Deleted" });
    load();
  };

  return (
    <div className="p-6 md:p-8 max-w-[1200px] mx-auto space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Media Studio</h1>
          <p className="text-muted-foreground mt-1">
            Upload videos, write blogs and add images to the Media page.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-full" asChild>
            <a href="/news" target="_blank" rel="noreferrer">
              View page <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
          <Button className="rounded-full font-semibold" onClick={openNew}>
            <Plus className="mr-2 h-4 w-4" /> New post
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Live on site", value: stats.published },
          { label: "Drafts", value: stats.drafts },
          { label: "Total posts", value: stats.total },
        ].map((s) => (
          <Card key={s.label} className="rounded-2xl">
            <CardContent className="p-5">
              <p className="text-3xl font-bold">{s.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList className="rounded-full">
          <TabsTrigger value="all" className="rounded-full">All</TabsTrigger>
          <TabsTrigger value="article" className="rounded-full">Blogs</TabsTrigger>
          <TabsTrigger value="video" className="rounded-full">Videos</TabsTrigger>
          <TabsTrigger value="image" className="rounded-full">Images</TabsTrigger>
        </TabsList>
      </Tabs>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : visible.length === 0 ? (
        <Card className="rounded-2xl border-dashed">
          <CardContent className="py-16 text-center">
            <UploadCloud className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg">Nothing here yet</h3>
            <p className="text-muted-foreground mt-1">
              Create your first post and choose where it appears on the Media page.
            </p>
            <Button className="rounded-full mt-6" onClick={openNew}>
              <Plus className="mr-2 h-4 w-4" /> New post
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {visible.map((p) => {
            const Icon = typeIcon(p.type);
            const place = PLACEMENTS.find((x) => x.value === p.placement);
            return (
              <Card key={p.id} className="rounded-2xl">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-20 h-16 rounded-xl overflow-hidden bg-secondary shrink-0 flex items-center justify-center">
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" />
                    ) : (
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary" className="rounded-full text-[10px] uppercase tracking-wider">
                        {p.category}
                      </Badge>
                      <Badge variant="outline" className="rounded-full text-[10px]">
                        {place?.label ?? p.placement}
                      </Badge>
                    </div>
                    <h3 className="font-semibold mt-1.5 truncate">{p.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {p.author ? `${p.author} · ` : ""}
                      Updated {timeAgo(p.updated_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="hidden sm:flex items-center gap-2">
                      <Switch
                        checked={p.status === "published"}
                        onCheckedChange={() => togglePublish(p)}
                        aria-label="Publish"
                      />
                      <span className="text-xs text-muted-foreground w-14">
                        {p.status === "published" ? "Live" : "Draft"}
                      </span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => openEdit(p)} aria-label="Edit">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteId(p.id)}
                      aria-label="Delete"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Editor */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle>{form.id ? "Edit post" : "New post"}</DialogTitle>
            <DialogDescription>
              Choose what you're posting and where it should show up on the Media page.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>What are you posting?</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {POST_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Where should it appear?</Label>
                <Select value={form.placement} onValueChange={(v) => setForm({ ...form, placement: v })}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PLACEMENTS.map((p) => (
                      <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {PLACEMENTS.find((p) => p.value === form.placement)?.hint}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Headline</Label>
              <Input
                className="rounded-xl"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Why this founder turned down $2M"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Author</Label>
                <Input
                  className="rounded-xl"
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  placeholder="Sean Walsh"
                />
              </div>
              <div className="space-y-2">
                <Label>{form.type === "video" ? "Length" : "Read time"}</Label>
                <Input
                  className="rounded-xl"
                  value={form.type === "video" ? form.duration : form.read_time}
                  onChange={(e) =>
                    setForm(
                      form.type === "video"
                        ? { ...form, duration: e.target.value }
                        : { ...form, read_time: e.target.value }
                    )
                  }
                  placeholder={form.type === "video" ? "8:12" : "5 min read"}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Short summary</Label>
              <Textarea
                className="rounded-xl"
                rows={2}
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                placeholder="One or two sentences shown under the headline."
              />
            </div>

            {form.type === "article" && (
              <div className="space-y-2">
                <Label>Full story (optional)</Label>
                <Textarea
                  className="rounded-xl"
                  rows={6}
                  value={form.body}
                  onChange={(e) => setForm({ ...form, body: e.target.value })}
                  placeholder="Write the full article here..."
                />
              </div>
            )}

            <FileField
              label={form.type === "image" ? "Image" : "Cover image"}
              accept="image/*"
              value={form.image_url}
              onChange={(url) => setForm({ ...form, image_url: url })}
              preview="image"
            />

            {form.type === "video" && (
              <FileField
                label="Video file"
                accept="video/*"
                value={form.video_url}
                onChange={(url) => setForm({ ...form, video_url: url })}
                preview="video"
              />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Link (optional)</Label>
                <Input
                  className="rounded-xl"
                  value={form.external_url}
                  onChange={(e) => setForm({ ...form, external_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label>Order</Label>
                <Input
                  type="number"
                  className="rounded-xl"
                  value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
                />
                <p className="text-xs text-muted-foreground">Lower numbers show first.</p>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border p-4">
              <div>
                <p className="font-medium text-sm">Publish to the Media page</p>
                <p className="text-xs text-muted-foreground">Turn off to keep it as a draft.</p>
              </div>
              <Switch
                checked={form.status === "published"}
                onCheckedChange={(c) => setForm({ ...form, status: c ? "published" : "draft" })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" className="rounded-full" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button className="rounded-full font-semibold" onClick={save} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {form.id ? "Save changes" : "Create post"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this post?</AlertDialogTitle>
            <AlertDialogDescription>
              It will be removed from the Media page. This can't be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
            <AlertDialogAction className="rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={remove}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function FileField({
  label,
  accept,
  value,
  onChange,
  preview,
}: {
  label: string;
  accept: string;
  value: string;
  onChange: (url: string) => void;
  preview: "image" | "video";
}) {
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const upload = async (file: File) => {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("media").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });
    if (error) {
      setUploading(false);
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
      return;
    }
    const { data } = await supabase.storage.from("media").createSignedUrl(path, TEN_YEARS);
    setUploading(false);
    if (data?.signedUrl) {
      onChange(data.signedUrl);
      toast({ title: "Uploaded" });
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const f = e.dataTransfer.files?.[0];
          if (f) upload(f);
        }}
        className="rounded-xl border border-dashed p-4 flex items-center gap-4"
      >
        {value ? (
          preview === "image" ? (
            <img src={value} alt="" className="w-24 h-16 rounded-lg object-cover" />
          ) : (
            <video src={value} className="w-24 h-16 rounded-lg object-cover bg-black" muted />
          )
        ) : (
          <div className="w-24 h-16 rounded-lg bg-secondary flex items-center justify-center">
            <UploadCloud className="h-5 w-5 text-muted-foreground" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-muted-foreground">
            {value ? "File added." : "Drag a file here, or choose one from your computer."}
          </p>
          <div className="flex gap-2 mt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
            >
              {uploading ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : null}
              {value ? "Replace" : "Choose file"}
            </Button>
            {value && (
              <Button type="button" variant="ghost" size="sm" className="rounded-full" onClick={() => onChange("")}>
                Remove
              </Button>
            )}
          </div>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) upload(f);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}
