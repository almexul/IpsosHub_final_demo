import React, { useMemo, useState } from "react";
import { NavLink, Outlet, useOutletContext } from "react-router-dom";
import {
  Settings2, User, LogOut, Search as SearchIcon, Link as LinkIcon,
  CalendarDays, Sparkles, GripVertical, Edit3, Trash2, Check, X, MapPin,Send,
  Newspaper,
  Bot,
  MessageSquare
} from "lucide-react";


type UserInfo = { name: string; email: string } | null;
type Shortcut = { label: string; href: string; isCustom?: boolean; docId?: string };
type Collection = { id: string; name: string; items: string[] };

type UserInformationContext = {
  role: string;
  setRole: (r: string) => void;
  user: UserInfo;
  setUser: React.Dispatch<React.SetStateAction<UserInfo>>;


  shortcutsByRole: Record<string, Shortcut[]>;
  setShortcutsByRole: React.Dispatch<React.SetStateAction<Record<string, Shortcut[]>>>;
  reorderShortcuts: (from: number | null, to: number | null) => void;
  addCustomShortcut: (s: Shortcut) => void;
  removeCustomShortcut: (docId: string) => void;

  bookmarks: Set<string>;
  setBookmarks: React.Dispatch<React.SetStateAction<Set<string>>>;

 
  collections: Collection[];
  newCollection: () => void;
  addToCollection: (colId: string, label: string) => void; // label (shortcut)
  removeFromCollection: (colId: string, item: string) => void;
  renameCollection: (colId: string, name: string) => void;
  deleteCollection: (colId: string) => void;
};

export function useUserInformationContext() {
  return useOutletContext<UserInformationContext>();
}


const ROLE_OPTIONS = ["SW", "PM", "DP", "QA", "IT"];
const DEFAULT_SHORTCUTS: Record<string, Shortcut[]> = {
  SW: [],
  PM: [],
  DP: [],
  QA: [],
  IT: [],
};
const DEFAULT_COLLECTIONS: Collection[] = [
  { id: "col-kickoff", name: "Tools Info Collection", items: ["shortcut:Merge Projects", "shortcut:ATR Tool"] },
];

const UPCOMING_EVENTS = [
  { id: "ev-party-buc", title: "Party Bucharest", date: "2025-09-25", location: "Bucharest" },
  { id: "ev-cooking-life", title: "Cooking for Life", date: "2025-09-29", location: "Brasov" },
  { id: "ev-hackathon", title: "Hackathon", date: "2025-10-09", location: "Bucharest/Brasov" },
  { id: "ev-behind-sam", title: "Behind the Scene with Sam Scot", date: null as string | null, location: "Bucharest" },
];

const NOW = new Date();
const formatEventDate = (dateStr: string | null) => {
  if (!dateStr) return "TBA";
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { day: "2-digit", month: "2-digit" });
};

const WHAT_IS_NEW = [
  { id: "upd-1", title: "IIS Data Transformation — docs refreshed", source: "Confluence", when: new Date(NOW.getTime() - 2 * 86400000) },
  { id: "upd-2", title: "Global QA template & functions", source: "KB", when: new Date(NOW.getTime() - 7 * 86400000) },
  { id: "upd-3", title: "Reporting — SSRS templates", source: "SharePoint", when: new Date(NOW.getTime() - 20 * 86400000) },
  { id: "upd-4", title: "Client Service — SoW templates", source: "Google Drive", when: new Date(NOW.getTime() - 14 * 86400000) },
  { id: "upd-5", title: "RAG How-To — Confluence & SharePoint", source: "Confluence", when: new Date(NOW.getTime() - 13 * 86400000) },
  { id: "upd-6", title: "KB — Permissions cheat sheet", source: "KB", when: new Date(NOW.getTime() - 5 * 86400000) },
];


function CollectionCard({
  col,
  onDropShortcut,
  onRemoveItem,
  onRename,
  onDelete,
}: {
  col: Collection;
  onDropShortcut: (label: string) => void;
  onRemoveItem: (item: string) => void;
  onRename: (name: string) => void;
  onDelete: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(col.name);

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const data = e.dataTransfer.getData("text/plain");
        if (data?.startsWith("shortcut:")) {
          const label = data.slice("shortcut:".length);
          onDropShortcut(label);
        }
      }}
      className="rounded-xl border border-neutral-800 p-3 bg-neutral-950/30"
    >
      <div className="flex items-center gap-2 mb-1">
        {editing ? (
          <>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 rounded-md border border-neutral-700 bg-neutral-950 px-2 py-1 text-sm outline-none"
            />
            <button
              onClick={() => {
                onRename(name.trim() || col.name);
                setEditing(false);
              }}
              className="rounded-md border border-neutral-700 px-2 py-1 text-xs hover:bg-neutral-800 inline-flex items-center gap-1"
            >
              <Check className="h-3.5 w-3.5" /> Save
            </button>
            <button
              onClick={() => {
                setName(col.name);
                setEditing(false);
              }}
              className="rounded-md border border-neutral-700 px-2 py-1 text-xs hover:bg-neutral-800 inline-flex items-center gap-1"
            >
              <X className="h-3.5 w-3.5" /> Cancel
            </button>
          </>
        ) : (
          <>
            <div className="text-sm font-semibold flex-1">{col.name}</div>
            <button
              onClick={() => setEditing(true)}
              className="rounded-md border border-neutral-700 px-2 py-1 text-xs hover:bg-neutral-800 inline-flex items-center gap-1"
            >
              <Edit3 className="h-3.5 w-3.5" /> Rename
            </button>
            <button
              onClick={onDelete}
              className="rounded-md border border-red-900/60 text-red-300 px-2 py-1 text-xs hover:bg-red-900/20 inline-flex items-center gap-1"
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </button>
          </>
        )}
      </div>

      <div className="flex flex-wrap gap-1 min-h-[28px]">
        {col.items.map((it) => {
          const isShortcut = String(it).startsWith("shortcut:");
          const label = isShortcut ? String(it).slice("shortcut:".length) : String(it);
          return (
            <span
              key={it}
              className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border border-neutral-700 bg-neutral-800/60"
            >
              {label}
              <button
                onClick={() => onRemoveItem(it)}
                className="ml-1 rounded-sm border border-neutral-700 px-1 leading-none hover:bg-neutral-700/50"
                title="Remove"
              >
                ×
              </button>
            </span>
          );
        })}
      </div>
      <div className="mt-2 text-[11px] text-neutral-500">Drop shortcuts here to add</div>
    </div>
  );
}


export default function PageLayout() {
  
  const [role, setRole] = useState<string>("SW");
  const [user, setUser] = useState<UserInfo>({ name: "Alexandru Paval", email: "Alexandru.Paval@ipsos.com" });

   const noResultSuggestions = ["Dimensions quota routing JSON", "Export weights SPSS to Excel", "Who to ask for DM Query"];

    const [assistantOpen, setAssistantOpen] = useState(false);
    function generateAssistantAnswer(Q: string) {
    const scored = DOCS.map(d => ({ doc: d, s: scoreDoc(d, Q, role, { onlyVerified, sources: sourceFilters }) }))
      .sort((a, b) => b.s - a.s).slice(0, 2).map(x => x.doc);
    const bullets = scored.map(d => `• ${d.title} (${d.source})`).join("\n");
    return `Based on your sources, here are some pointers:\n- ${scored[0]?.content_excerpt || 'No direct match.'}\n- ${scored[1]?.content_excerpt || ''}\n\nSources:\n${bullets}`;
    }

  
  const [shortcutsByRole, setShortcutsByRole] = useState<Record<string, Shortcut[]>>({ ...DEFAULT_SHORTCUTS });
  const [collections, setCollections] = useState<Collection[]>(DEFAULT_COLLECTIONS);
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());

  function reorderShortcuts(from: number | null, to: number | null) {
    if (from === null || to === null || from === to) return;
    setShortcutsByRole((prev) => {
      const arr = [...(prev[role] || [])];
      const [moved] = arr.splice(from, 1);
      arr.splice(to, 0, moved);
      return { ...prev, [role]: arr };
    });
  }
  function addCustomShortcut(s: Shortcut) {
    setShortcutsByRole((prev) => {
      const arr = [...(prev[role] || [])];
      const exists = s.docId ? arr.some((it) => it.isCustom && it.docId === s.docId) : arr.some((it) => it.label === s.label);
      if (!exists) arr.push({ ...s, isCustom: true });
      return { ...prev, [role]: arr };
    });
  }
  function removeCustomShortcut(docId: string) {
    setShortcutsByRole((prev) => {
      const arr = [...(prev[role] || [])].filter((it) => !(it.isCustom && it.docId === docId));
      return { ...prev, [role]: arr };
    });
  }

  function newCollection() {
    setCollections((cols) => [...cols, { id: `col-${Date.now()}`, name: `My Collection ${cols.length + 1}`, items: [] }]);
  }
  function addToCollection(colId: string, label: string) {
    setCollections((cols) => cols.map((c) => (c.id === colId ? { ...c, items: Array.from(new Set([...c.items, `shortcut:${label}`])) } : c)));
  }
  function removeFromCollection(colId: string, item: string) {
    setCollections((cols) => cols.map((c) => (c.id === colId ? { ...c, items: c.items.filter((x) => x !== item) } : c)));
  }
  function renameCollection(colId: string, name: string) {
    setCollections((cols) => cols.map((c) => (c.id === colId ? { ...c, name } : c)));
  }
  function deleteCollection(colId: string) {
    setCollections((cols) => cols.filter((c) => c.id !== colId));
  }

  const upcomingEvents = useMemo(() => {
    const today = new Date(NOW.toDateString());
    return UPCOMING_EVENTS
      .filter((e) => !e.date || new Date(e.date) >= today)
      .sort((a, b) => new Date(a.date || "2100-01-01").getTime() - new Date(b.date || "2100-01-01").getTime());
  }, []);

  const navLinkClass =
    "rounded-xl border border-neutral-800 px-3 py-2 text-sm hover:bg-neutral-900 transition-colors flex items-center gap-2";
  function AssistantWidget({ open, setOpen, onAsk, suggestions }: any) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([{ role: "assistant", text: "Hi! I can help refine your search or answer. Ask me anything." }]);
  function send(text?: string) {
    const q = (text ?? input).trim();
    if (!q) return;
    setMessages((m) => [...m, { role: "user", text: q }]);
    setInput("");
    const ans = onAsk(q);
    setMessages((m) => [...m, { role: "assistant", text: ans }]);
  }
  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open && (
        <div className="w-[320px] sm:w-[380px] rounded-2xl border border-neutral-800 bg-neutral-950 shadow-xl">
          <div className="flex items-center justify-between px-3 py-2 border-b border-neutral-800">
            <div className="flex items-center gap-2 text-sm font-semibold"><MessageSquare className="h-4 w-4" /> Assistant</div>
            <button className="rounded-md border border-neutral-700 p-1 hover:bg-neutral-800" onClick={() => setOpen(false)} aria-label="Close"><X className="h-4 w-4" /></button>
          </div>
          <div className="max-h-64 overflow-y-auto p-3 space-y-2 text-sm">
            {messages.map((m, i) => (
              <div key={i} className={`rounded-xl px-3 py-2 border ${m.role === 'user' ? 'ml-auto bg-emerald-900/20 border-emerald-700/40' : 'bg-neutral-900/60 border-neutral-800'}`}>
                {m.text}
              </div>
            ))}
            {(!messages || messages.length <= 1) && suggestions?.length > 0 && (
              <div className="text-xs text-neutral-400">
                Try:
                <div className="mt-1 flex flex-wrap gap-1">
                  {suggestions.map((s: string, i: number) => (
                    <button key={i} onClick={() => send(s)} className="rounded-full border border-neutral-700 px-2 py-0.5 hover:bg-neutral-800">{s}</button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="p-3 border-t border-neutral-800">
            <div className="flex items-center gap-2">
              <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') send(); }} placeholder="Ask a follow-up…" className="flex-1 rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 outline-none text-sm" />
              <button onClick={() => send()} className="rounded-lg border border-neutral-700 px-3 py-2 hover:bg-neutral-800 text-sm inline-flex items-center gap-1"><Send className="h-4 w-4" /> Send</button>
            </div>
          </div>
        </div>
      )}
      {!open && (
        <button onClick={() => setOpen(true)} className="rounded-full border border-neutral-700 bg-neutral-950 px-4 py-2 shadow-lg inline-flex items-center gap-2 text-sm hover:bg-neutral-900">
          <MessageSquare className="h-4 w-4" /> Ask Assistant
        </button>
      )}
    </div>
  );
}
  return (
    <div className="min-h-screen w-full bg-neutral-950 text-neutral-100">
      
      <div className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/60 bg-neutral-950/80 border-b border-neutral-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3">
        
          <div className="flex items-center gap-2">
            <NavLink to="/search" className={"flex items-center gap-2"}>
              <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-blue-500 grid place-items-center font-bold">IH</div>
              <div className="text-sm uppercase tracking-widest text-neutral-300">Ipsos Hub</div>
            </NavLink>
          </div>

     
          <nav className="ml-4 hidden md:flex items-center gap-2">
            <NavLink to="/searchDasboard" className={({ isActive }) => `${navLinkClass} ${isActive ? "bg-neutral-900" : ""}`}>
              <SearchIcon className="h-4 w-4" /> Search
            </NavLink>
            <NavLink to="/resources" className={({ isActive }) => `${navLinkClass} ${isActive ? "bg-neutral-900" : ""}`}>
              <LinkIcon className="h-4 w-4" /> Links & Tools
            </NavLink>
            <NavLink to="/productionUpdates" className={({ isActive }) => `${navLinkClass} ${isActive ? "bg-neutral-900" : ""}`}>
              <Bot  className="h-4 w-4" /> Production updates
            </NavLink>
            <NavLink to="/news" className={({ isActive }) => `${navLinkClass} ${isActive ? "bg-neutral-900" : ""}`}>
              <Newspaper  className="h-4 w-4" /> News & Events
            </NavLink>
          </nav>

      
          <div className="ml-auto flex items-center gap-2">
            <div className="hidden sm:flex rounded-xl border border-neutral-800 px-3 py-2 items-center gap-2">
              <Settings2 className="h-4 w-4" /> Role:
              <select className="bg-transparent outline-none" value={role} onChange={(e) => setRole(e.target.value)}>
                {ROLE_OPTIONS.map((r) => (
                  <option key={r} value={r} className="bg-neutral-950 text-neutral-100">
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative group rounded-xl border border-neutral-800 px-3 py-2 flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="text-sm hidden sm:inline">{user?.name ?? "User"}</span>
              <div className="absolute right-0 top-full mt-1 hidden group-hover:block">
                <button
                  onClick={() => setUser(null)}
                  className="rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-1.5 text-xs hover:bg-neutral-900 inline-flex items-center gap-2 w-max"
                >
                  <LogOut className="h-4 w-4" /> Log out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        
        <aside className="space-y-4">
         
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold">Your Shortcuts & Collections</div>
              <button onClick={newCollection} className="text-xs underline opacity-80 hover:opacity-100">New</button>
            </div>

           
            <LayoutShortcuts
              role={role}
              shortcutsByRole={shortcutsByRole}
              reorderShortcuts={reorderShortcuts}
              removeCustomShortcut={removeCustomShortcut}
            />

       
            <div className="space-y-3">
              {collections.map((c) => (
                <CollectionCard
                  key={c.id}
                  col={c}
                  onDropShortcut={(label) => addToCollection(c.id, label)}
                  onRemoveItem={(item) => removeFromCollection(c.id, item)}
                  onRename={(name) => renameCollection(c.id, name)}
                  onDelete={() => deleteCollection(c.id)}
                />
              ))}
            </div>
          </div>

        
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-4">
            <div className="text-sm font-semibold mb-3">What’s new</div>
            <div className="space-y-3">
              {WHAT_IS_NEW.map((u) => (
                <div key={u.id} className="flex items-start gap-2">
                  <div className="h-2 w-2 mt-2 rounded-full bg-emerald-400" />
                  <div>
                    <div className="text-sm font-medium">{u.title}</div>
                    <div className="text-xs text-neutral-400">
                      {u.source} • {u.when.toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-4">
            <div className="text-sm font-semibold mb-3">Upcoming events</div>
            <div className="space-y-2">
              {upcomingEvents.map((e) => (
                <a
                  key={e.id}
                  href="news"
                  className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-950/40 px-3 py-2 hover:bg-neutral-900"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <CalendarDays className="h-4 w-4 text-neutral-400" />
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{e.title}</div>
                      {e.location && (
                        <div className="text-[11px] text-neutral-400 inline-flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {e.location}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-neutral-400 ml-2 shrink-0">{formatEventDate(e.date)}</div>
                </a>
              ))}
            </div>
          </div>
        </aside>


        <main>
          <Outlet
            context={{
              role,
              setRole,
              user,
              setUser,
              shortcutsByRole,
              setShortcutsByRole,
              reorderShortcuts,
              addCustomShortcut,
              removeCustomShortcut,
              bookmarks,
              setBookmarks,
              collections,
              newCollection,
              addToCollection,
              removeFromCollection,
              renameCollection,
              deleteCollection,
            }}
          />
        </main>
        <AssistantWidget
        open={assistantOpen}
        setOpen={setAssistantOpen}
        onAsk={(q: string) => generateAssistantAnswer(q)}
        suggestions={noResultSuggestions}
      />
      </div>

    
      <div className="border-t border-neutral-800 py-6 text-center text-xs text-neutral-500">
        Hackathon Demo • Centralized, Role-based Knowledge Hub
      </div>
    </div>
  );
}


function LayoutShortcuts({
  role,
  shortcutsByRole,
  reorderShortcuts,
  removeCustomShortcut,
}: {
  role: string;
  shortcutsByRole: Record<string, Shortcut[]>;
  reorderShortcuts: (from: number | null, to: number | null) => void;
  removeCustomShortcut: (docId: string) => void;
}) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const list = shortcutsByRole[role] || [];

  return (
    <div className="space-y-2 mb-4">
      {list.map((s, idx) => (
        <div
          key={`${s.label}-${idx}`}
          draggable
          onDragStart={(e) => {
            setDragIndex(idx);
            e.dataTransfer.effectAllowed = "move";
            e.dataTransfer.setData("text/plain", `shortcut:${s.label}`);
          }}
          onDragOver={(e) => {
            e.preventDefault();
          }}
          onDrop={(e) => {
            e.preventDefault();
            reorderShortcuts(dragIndex, idx);
            setDragIndex(null);
          }}
          className="flex items-center gap-2 rounded-xl border border-neutral-800 px-3 py-2 bg-neutral-950/40 hover:bg-neutral-900 cursor-grab"
        >
          <GripVertical className="h-3.5 w-3.5 text-neutral-500" />
          <a href={s.href} className="text-sm truncate" title={s.label}>
            {s.label}
          </a>
          {s.isCustom && s.docId && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeCustomShortcut(s.docId!);
              }}
              className="ml-auto rounded-md border border-neutral-700 px-1.5 py-1 text-xs hover:bg-neutral-800"
              title="Remove from shortcuts"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      ))}
      {list.length === 0 && <div className="text-xs text-neutral-500">No shortcuts yet.</div>}
    </div>
  );
}
