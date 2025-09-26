
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuCheckboxItem, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import {
  Copy, ExternalLink, Link as LinkIcon, MoreVertical, Pin, PinOff, Plus, Search,
  Star, StarOff, Tag as TagIcon, Wrench, Code2, MessageSquare, Database, FileText, Globe,
  Settings2, User, LogOut,
} from "lucide-react";

export type ToolLink = {
  id: string;
  title: string;
  url: string;
  category: string;
  tags?: string[];   
  icon?: "wrench" | "code" | "chat" | "db" | "doc" | "globe" | "link";
  favorite?: boolean;
  pinned?: boolean;
};

const STORAGE_KEY = "ih.tools.links";

export const ROLE_TAGS = ["sw", "pm", "dp", "qa"] as const;
const ROLE_SET = new Set<string>([...ROLE_TAGS]);

export function normalizeRoles(input: string[]): string[] {
  const out = new Set<string>();
  for (const r of input) {
    const k = String(r).toLowerCase().trim();
    if (ROLE_SET.has(k)) out.add(k);
  }
  return Array.from(out);
}

const DEFAULT_LINKS: ToolLink[] = [
  { id: "NWB", title: "NWB", url: "https://google.com", category: "Ipsos", tags: ["pm"], icon: "wrench", pinned: true },
  { id: "Survey_event", title: "Survey event", url: "https://example.com", category: "Ipsos", tags: ["pm"], icon: "chat", favorite: true, pinned: true },
  { id: "Iquote", title: "Iquote", url: "https://example.com", category: "AI", tags: ["pm"], icon: "chat" },
  { id: "Cortex", title: "Cortex", url: "https://example.com", category: "Work", tags: ["pm"], icon: "wrench" },
  { id: "S1", title: "S1", url: "https://example.com", category: "Docs", tags: ["pm"], icon: "doc" },
  { id: "Sharpoint", title: "Sharpoint", url: "https://example.com", category: "Docs", tags: ["pm"], icon: "code" },
  
  { id: "Dim 7.5", title: "Dim 7.5", url: "https://example.com", category: "Comms", tags: ["pm"], icon: "globe" },
  { id: "teams", title: "Microsoft Teams", url: "https://example.com", category: "Comms", tags: ["pm", "dp", "qa", "sw"], icon: "chat" },
  { id: "spss", title: "IBM SPSS", url: "https://example.com", category: "Work", tags: ["dp"], icon: "db" },
  { id: "dmquery", title: "DM Query", url: "https://example.com", category: "Work", tags: ["dp", "sw"], icon: "db" },
];

const CATEGORY_ORDER = [
  "SW", "PM", "QA", "DP", "HR", "Other",
];

const iconMap = {
  wrench: <Wrench className="h-5 w-5" />,
  code: <Code2 className="h-5 w-5" />,
  chat: <MessageSquare className="h-5 w-5" />,
  db: <Database className="h-5 w-5" />,
  doc: <FileText className="h-5 w-5" />,
  globe: <Globe className="h-5 w-5" />,
  link: <LinkIcon className="h-5 w-5" />,
} as const;

export function domainOf(url: string): string {
  try { return new URL(url).hostname.replace("www.", ""); } catch { return url; }
}

function saveToStorage(data: ToolLink[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
function loadFromStorage(): ToolLink[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ToolLink[]) : null;
  } catch { return null; }
}


function useToolForm(init?: Partial<ToolLink>) {
  const [title, setTitle] = useState(init?.title ?? "");
  const [url, setUrl] = useState(init?.url ?? "");
  const [category, setCategory] = useState(init?.category ?? "Other");
  const [selectedTags, setSelectedTags] = useState<string[]>(normalizeRoles(init?.tags ?? []));
  const [icon, setIcon] = useState<ToolLink["icon"]>(init?.icon ?? "link");
  return { title, setTitle, url, setUrl, category, setCategory, selectedTags, setSelectedTags, icon, setIcon };
}


function LinkCard({
  item, onToggleFav, onTogglePin, onEdit, onRemove,
}: {
  item: ToolLink;
  onToggleFav: (id: string) => void;
  onTogglePin: (id: string) => void;
  onEdit: (item: ToolLink) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="overflow-hidden border border-zinc-900 bg-zinc-950 text-zinc-100">
        <CardHeader className="p-4 pb-2">
          <div className="flex items-start gap-3">
            <div className="mt-0.5">{iconMap[item.icon ?? "link"]}</div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base leading-tight truncate">{item.title}</CardTitle>
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <ExternalLink className="h-3.5 w-3.5" />
                <span className="truncate">{domainOf(item.url)}</span>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-300 hover:bg-zinc-900">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-black text-zinc-100 border-zinc-900">
                <DropdownMenuItem onClick={() => onTogglePin(item.id)}>
                  {item.pinned ? <PinOff className="mr-2 h-4 w-4" /> : <Pin className="mr-2 h-4 w-4" />}
                  {item.pinned ? "Unpin" : "Pin to top"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onToggleFav(item.id)}>
                  {item.favorite ? <StarOff className="mr-2 h-4 w-4" /> : <Star className="mr-2 h-4 w-4" />}
                  {item.favorite ? "Remove favorite" : "Mark favorite"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onEdit(item)}>Edit</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onRemove(item.id)} className="text-red-400">Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-2 space-y-3">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-zinc-900 text-zinc-300 border border-zinc-800">{item.category}</Badge>
            {(item.tags ?? []).map((t) => (
              <Badge key={t} variant="secondary" className="bg-blue-900/40 text-blue-200 border border-blue-900 hover:bg-blue-900/60">
                {t.toUpperCase()}
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Button className="flex-1 bg-blue-700 hover:bg-blue-600" onClick={() => window.open(item.url, "_blank")}>Open</Button>
            <Button variant="secondary" className="bg-blue-900/40 text-blue-200 hover:bg-blue-900/60 border border-blue-900" onClick={() => navigator.clipboard.writeText(item.url)}>
              <Copy className="mr-2 h-4 w-4" /> Copy
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function UpsertDialog({
  open, onOpenChange, onSave, initial,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSave: (link: ToolLink) => void;
  initial?: ToolLink | null;
}) {
  const form = useToolForm(initial ?? undefined);

  useEffect(() => {
    if (initial) {
      form.setTitle(initial.title);
      form.setUrl(initial.url);
      form.setCategory(initial.category ?? "Other");
      form.setSelectedTags(normalizeRoles(initial.tags ?? []));
      form.setIcon(initial.icon ?? "link");
    } else {
      form.setTitle(""); form.setUrl(""); form.setCategory("Other"); form.setSelectedTags([]); form.setIcon("link");
    }
  }, [initial?.id, open]);

  function handleSubmit() {
    if (!form.title.trim()) return alert("Title is required");
    if (!form.url.trim()) return alert("URL is required");
    try { new URL(form.url); } catch { return alert("Invalid URL"); }

    const link: ToolLink = {
      id: initial?.id ?? `custom-${Date.now()}`,
      title: form.title.trim(),
      url: form.url.trim(),
      category: form.category.trim() || "Other",
      tags: normalizeRoles(form.selectedTags),
      icon: form.icon ?? "link",
      favorite: initial?.favorite ?? false,
      pinned: initial?.pinned ?? false,
    };
    onSave(link);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-black border border-zinc-900 text-zinc-100">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit link" : "Add a new link"}</DialogTitle>
          <DialogDescription>Add quick-access tools and links for your daily flow.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label>Title</Label>
            <Input value={form.title} onChange={(e) => form.setTitle(e.target.value)} placeholder="e.g. Merge Tool" className="bg-zinc-950 border-zinc-900" />
          </div>

          <div className="grid gap-2">
            <Label>URL</Label>
            <Input value={form.url} onChange={(e) => form.setUrl(e.target.value)} placeholder="https://…" className="bg-zinc-950 border-zinc-900" />
          </div>

          <div className="grid gap-2">
            <Label>Category</Label>
            <Input value={form.category} onChange={(e) => form.setCategory(e.target.value)} placeholder="e.g. AI / Docs / Video / Comms…" className="bg-zinc-950 border-zinc-900" />
          </div>

          <div className="grid gap-2">
            <Label>Tags (roles)</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="justify-between bg-zinc-950 border-zinc-900 text-zinc-200">
                  <span className="inline-flex items-center gap-2">
                    <TagIcon className="h-4 w-4" /> Choose roles
                  </span>
                  <span className="text-xs text-zinc-400">{form.selectedTags.length} selected</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-black text-zinc-100 border-zinc-900">
                {([...ROLE_TAGS] as string[]).map((r) => {
                  const checked = form.selectedTags.includes(r);
                  return (
                    <DropdownMenuCheckboxItem
                      key={r}
                      checked={checked}
                      onCheckedChange={(v) => {
                        if (v) form.setSelectedTags(normalizeRoles([...form.selectedTags, r]));
                        else form.setSelectedTags(form.selectedTags.filter((x) => x !== r));
                      }}
                    >
                      {r.toUpperCase()}
                    </DropdownMenuCheckboxItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

       
          <div className="grid gap-2">
            <Label>Icon</Label>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["link", "Link"],
                  ["wrench", "Tool"],
                  ["code", "Code"],
                  ["chat", "Chat"],
                  ["db", "Data"],
                  ["doc", "Docs"],
                  ["globe", "Web"],
                ] as const
              ).map(([key, label]) => (
                <Button
                  key={key}
                  type="button"
                  variant={form.icon === key ? "default" : "secondary"}
                  className={form.icon === key ? "h-8 bg-blue-700 hover:bg-blue-600" : "h-8 bg-blue-900/40 text-blue-200 border border-blue-900 hover:bg-blue-900/60"}
                  onClick={() => form.setIcon(key)}
                >
                  <span className="mr-2">{iconMap[key]}</span>
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button className="bg-blue-700 hover:bg-blue-600" onClick={handleSubmit}>{initial ? "Save changes" : "Add link"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


export default function Resources() {

  const [links, setLinks] = useState<ToolLink[]>(() => loadFromStorage() ?? DEFAULT_LINKS);
  const [query, setQuery] = useState("");
  const [activeCats, setActiveCats] = useState<string[]>([]);
  const [onlyFavs, setOnlyFavs] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<ToolLink | null>(null);

  const categories = useMemo(() => {
    const all = new Set<string>([...CATEGORY_ORDER]);
    links.forEach((l) => all.add(l.category ?? "Other"));
    return Array.from(all);
  }, [links]);

  useEffect(() => { saveToStorage(links); }, [links]);

  function toggleFav(id: string) {
    setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, favorite: !l.favorite } : l)));
  }
  function togglePin(id: string) {
    setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, pinned: !l.pinned } : l)));
  }
  function removeLink(id: string) {
    if (!confirm("Delete this link?")) return;
    setLinks((prev) => prev.filter((l) => l.id !== id));
  }
  function upsertLink(link: ToolLink) {
    setLinks((prev) => {
      const exists = prev.some((l) => l.id === link.id);
      if (exists) return prev.map((l) => (l.id === link.id ? link : l));
      return [link, ...prev];
    });
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const byQuery = (l: ToolLink) =>
      !q ||
      l.title.toLowerCase().includes(q) ||
      l.url.toLowerCase().includes(q) ||
      (l.tags ?? []).some((t) => t.toLowerCase().includes(q)) ||
      (l.category ?? "").toLowerCase().includes(q);
    const byCats = (l: ToolLink) => activeCats.length === 0 || activeCats.includes(l.category ?? "Other");
    const byFav = (l: ToolLink) => !onlyFavs || l.favorite;

    const list = links.filter((l) => byQuery(l) && byCats(l) && byFav(l));

    const catIndex = (c: string) => {
      const i = CATEGORY_ORDER.indexOf(c);
      return i === -1 ? 999 : i;
    };
    return list.sort((a, b) => {
      if ((b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) !== 0) return (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0);
      if ((b.favorite ? 1 : 0) - (a.favorite ? 1 : 0) !== 0) return (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0);
      const ci = catIndex(a.category ?? "Other") - catIndex(b.category ?? "Other");
      if (ci !== 0) return ci;
      return a.title.localeCompare(b.title);
    });
  }, [links, query, activeCats, onlyFavs]);

  const pinned = filtered.filter((l) => l.pinned);
  const rest = filtered.filter((l) => !l.pinned);

  return (
    <div className="min-h-screen w-full bg-black text-zinc-100">
    
      <div className="mx-auto w-full max-w-7xl px-4 py-6">

        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">

          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-[260px]">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title, URL, tag…"
                className="pl-8 bg-zinc-950 border-zinc-900 text-zinc-100 placeholder:text-zinc-500"
              />
            </div>

            <Dialog open={dialogOpen} onOpenChange={(v) => { setDialogOpen(v); if (!v) setEditItem(null); }}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-blue-700 hover:bg-blue-600"><Plus className="h-4 w-4" />Add</Button>
              </DialogTrigger>
              <UpsertDialog
                open={dialogOpen}
                onOpenChange={(v) => { setDialogOpen(v); if (!v) setEditItem(null); }}
                onSave={(link) => upsertLink(link)}
                initial={editItem}
              />
            </Dialog>
          </div>
        </div>

 
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Button
            variant={onlyFavs ? "default" : "secondary"}
            onClick={() => setOnlyFavs((v) => !v)}
            className={onlyFavs ? "bg-blue-700 hover:bg-blue-600" : "bg-blue-900/40 text-blue-200 hover:bg-blue-900/60 border border-blue-900"}
          >
            {onlyFavs ? <Star className="mr-2 h-4 w-4" /> : <StarOff className="mr-2 h-4 w-4" />} Favorites
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-zinc-950 border-zinc-900 text-zinc-200">
                Categories
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="bg-black text-zinc-100 border-zinc-900">
              {categories.map((c) => {
                const checked = activeCats.includes(c);
                return (
                  <DropdownMenuCheckboxItem
                    key={c}
                    checked={checked}
                    onCheckedChange={(v) => {
                      if (v) setActiveCats([...activeCats, c]);
                      else setActiveCats(activeCats.filter((x) => x !== c));
                    }}
                  >
                    {c}
                  </DropdownMenuCheckboxItem>
                );
              })}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setActiveCats([])}>Clear</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

     
        {pinned.length > 0 && (
          <div className="mb-6">
            <div className="mb-2 text-xs uppercase tracking-widest text-zinc-400">Pinned</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {pinned.map((item) => (
                <LinkCard
                  key={item.id}
                  item={item}
                  onToggleFav={toggleFav}
                  onTogglePin={togglePin}
                  onEdit={(it) => { setEditItem(it); setDialogOpen(true); }}
                  onRemove={removeLink}
                />
              ))}
            </div>
          </div>
        )}

     
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {rest.map((item) => (
            <LinkCard
              key={item.id}
              item={item}
              onToggleFav={toggleFav}
              onTogglePin={togglePin}
              onEdit={(it) => { setEditItem(it); setDialogOpen(true); }}
              onRemove={removeLink}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-10 rounded-xl border border-neutral-800 p-6 text-sm text-neutral-300">
            No links match the current filters.
          </div>
        )}
      </div>
    </div>
  );
}
