import React, { useMemo, useState } from "react";
import {
  Search, Star, StarOff, Filter, Globe, X, Send, MessageSquare, Sparkles
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUserInformationContext } from "../LayoutsOfThePages/MainLayout/PageLayout";


const NOW = new Date();
const daysAgo = (n: number) => new Date(NOW.getTime() - n * 86400000).toISOString();

const DOCS = [
  {
    id: "QA_1",
    title: "QA: Merge process",
    source: "KB",
    url: "#",
    content_excerpt: "Merging is the process by which the case data from two or more data sources are combined into a single data source. Merging is typically used after the case data has been collected and before the analysis stage of the survey takes place. ",
    tags: ["SPSS","HowTo"],
    roles: ["QA"],
    country: "RO",
    project_phase: ["QA"],
    last_modified: daysAgo(3),
    last_verified: daysAgo(5),
    owner: "QA@ipsos",
    clicks: 42
  },
  {
    id: "QA_2",
    title: "IIS Data Transformation Application",
    source: "Confluence",
    url: "#",
    content_excerpt: "This document is available to all QAs and DPs and describes the required steps in order to obtain specific types of data export, according to your clients needs.",
    tags: ["Dimensions","Quota","Routing","JSON"],
    roles: ["QA","DP"],
    business_unit: "Operations",
    country: "RO",
    project_phase: ["QA","DP"],
    last_modified: daysAgo(2),
    last_verified: daysAgo(10),
    owner: "QA_DP@ipsos",
    clicks: 55
  },
  {
    id: "QA_3",
    title: "Global QA template & functions",
    source: "KB",
    url: "#",
    content_excerpt: "This document is available to all scriptwriters and describes the required steps in order to use the DMS QA predefined functions.",
    tags: ["DM Query","SQL","CooKBook"],
    roles: ["QA"],
    business_unit: "Operations",
    country: "RO",
    project_phase: ["DP"],
    last_modified: daysAgo(7),
    last_verified: daysAgo(20),
    owner: "QA@ipsos",
    clicks: 31
  },
  {
    id: "Production_1",
    title: "BEST PRACTICE",
    source: "KB",
    url: "#",
    content_excerpt: "A list of best practices for all production roles",
    tags: ["Fieldwork","Kickoff","Templates"],
    roles: ["PM","SW","QA"],
    business_unit: "Client Service",
    country: "RO",
    project_phase: ["Fieldwork","Planning"],
    last_modified: daysAgo(1),
    last_verified: daysAgo(1),
    owner: "SW_QA_PM@ipsos",
    clicks: 77
  },
  {
    id: "SW_1",
    title: "ATR TOOL",
    source: "Tools",
    url: "#",
    content_excerpt: "ATR - MDD Case Data Generator",
    tags: ["SLA","QA"],
    roles: ["QA","SW"],
    business_unit: "Operations",
    country: "RO",
    project_phase: ["QA","Delivery"],
    last_modified: daysAgo(12),
    last_verified: daysAgo(40),
    owner: "SW@ipsos",
    clicks: 19
  },
  {
    id: "SW_2",
    title: "IIS Fish JSON Builder",
    source: "Tools",
    url: "#",
    content_excerpt: "This is an application ment to help scriptwriters generate the JSON string used in IIS Fish question looks.",
    tags: ["Directory","Contacts","People"],
    roles: ["SW"],
    business_unit: "HR",
    country: "RO",
    project_phase: ["All"],
    last_modified: daysAgo(4),
    last_verified: daysAgo(9),
    owner: "SW@ipsos",
    clicks: 64
  },
  {
    id: "SW_3",
    title: "Merge Projects",
    source: "Confluence",
    url: "#",
    content_excerpt: "The Merge Projects tool is a Desktop application used by scriptwriters in order to:,create a new mdd starting from the production template,update the template for an existing mdd,update cortex screeners (metadata and/or routing),update a product template to a usable project (IQConcepts, AsiCheck, ConnectV8, etc...),set ExcludefromDataExport to False for all Cortex Screeners Variables called in 'Section Survey'",
    tags: ["SPSS","Weights","Excel"],
    roles: ["SW"],
    business_unit: "Operations",
    country: "RO",
    project_phase: ["DP"],
    last_modified: daysAgo(8),
    last_verified: daysAgo(15),
    owner: "SW@ipsos",
    clicks: 28
  },
  {
    id: "gdrive-qa-forms",
    title: "QA Forms — Data Checks & Acceptance Criteria",
    source: "Google Drive",
    url: "#",
    content_excerpt: "Downloadable QA forms with enumerator checks, missingness thresholds, and scripts ...",
    tags: ["QA","Forms","Checks"],
    roles: ["QA","PM","Field"],
    business_unit: "Operations",
    country: "RO",
    project_phase: ["QA"],
    last_modified: daysAgo(6),
    last_verified: daysAgo(6),
    owner: "qa-office@ipsos",
    clicks: 22
  },
  {
    id: "sharepoint-ssrs",
    title: "Reporting — SSRS dashboard templates for trackers",
    source: "SharePoint",
    url: "#",
    content_excerpt: "Parameterised SSRS templates, deployment steps, and role-based views for clients ...",
    tags: ["Reporting","SSRS","Templates"],
    roles: ["DP","PM","IT"],
    business_unit: "Operations",
    country: "RO",
    project_phase: ["Delivery"],
    last_modified: daysAgo(20),
    last_verified: daysAgo(55),
    owner: "reporting@ipsos",
    clicks: 12
  },
  {
    id: "confluence-rag",
    title: "RAG How-To — Connect Confluence & SharePoint",
    source: "Confluence",
    url: "#",
    content_excerpt: "Architecture for read-only connectors with security trimming and vector search ...",
    tags: ["RAG","Architecture","Search"],
    roles: ["IT","Scripting"],
    business_unit: "IT",
    country: "RO",
    project_phase: ["Architecture"],
    last_modified: daysAgo(13),
    last_verified: daysAgo(13),
    owner: "platform@ipsos",
    clicks: 33
  },
  {
    id: "confluence-style",
    title: "Survey Scripting Style Guide — Dimensions",
    source: "Confluence",
    url: "#",
    content_excerpt: "Naming, routing, quotas, metadata, and versioning conventions for multi-country ...",
    tags: ["Dimensions","Style","Standards"],
    roles: ["Scripting","QA"],
    business_unit: "Operations",
    country: "RO",
    project_phase: ["Scripting"],
    last_modified: daysAgo(9),
    last_verified: daysAgo(9),
    owner: "scripting-guild@ipsos",
    clicks: 45
  },
  {
    id: "drive-templates-cs",
    title: "Client Service — Proposal & Timeline Templates",
    source: "Google Drive",
    url: "#",
    content_excerpt: "Branded proposal, SoW, and timeline templates ready for adaptation ...",
    tags: ["Templates","Client Service","SoW"],
    roles: ["PM","ClientService"],
    business_unit: "Client Service",
    country: "RO",
    project_phase: ["Planning"],
    last_modified: daysAgo(14),
    last_verified: daysAgo(14),
    owner: "cs-office@ipsos",
    clicks: 26
  },
  {
    id: "KB-permissions",
    title: "KB — Project Permissions Cheat Sheet",
    source: "KB",
    url: "#",
    content_excerpt: "Common permission schemes, roles, and tips for granting browse/edit without exposing restricted issues...",
    tags: ["KB","Permissions","KB"],
    roles: ["PM","QA","IT"],
    business_unit: "Operations",
    country: "RO",
    project_phase: ["Planning","QA"],
    last_modified: daysAgo(5),
    last_verified: daysAgo(5),
    owner: "platform@ipsos",
    clicks: 24
  },
  {
    id: "KB-workflows",
    title: "KB — Standard Workflows & Transitions",
    source: "KB",
    url: "#",
    content_excerpt: "Example workflows for software & ops projects, with recommended transitions and status categories...",
    tags: ["KB","Workflows","KB"],
    roles: ["SW/QA","PM","IT"],
    business_unit: "Operations",
    country: "RO",
    project_phase: ["Scripting","Delivery"],
    last_modified: daysAgo(11),
    last_verified: daysAgo(11),
    owner: "platform@ipsos",
    clicks: 18
  }
];

const SOURCES = ["Confluence", "KB", "SharePoint", "Google Drive", "Tools"];
const withinDays = (iso: string, n: number) => (NOW.getTime() - new Date(iso).getTime()) / 86400000 <= n;
const formatDate = (iso: string) => { try { return new Date(iso).toLocaleDateString(); } catch { return String(iso); } };

function scoreDoc(doc: any, q: string, role: string, filters: { onlyVerified: boolean; sources: string[]; }) {
  let s = 0;
  const Q = q.trim().toLowerCase();
  const inTitle = doc.title.toLowerCase().includes(Q);
  const inExcerpt = doc.content_excerpt.toLowerCase().includes(Q);
  const tagHit = doc.tags.some((t: string) => t.toLowerCase().includes(Q));
  if (!Q) s += 2;
  if (inTitle) s += 8;
  if (inExcerpt) s += 4;
  if (tagHit) s += 3;
  if (doc.roles.includes(role)) s += 3;
  if (withinDays(doc.last_verified, 60)) s += 2;
  s += Math.min(5, Math.floor(doc.clicks / 15));
  if (filters.onlyVerified && !withinDays(doc.last_verified, 60)) s -= 100;
  if (filters.sources.length && !filters.sources.includes(doc.source)) s -= 100;
  return s;
}

function SourceBadge({ source }: { source: string }) {
  const colors: Record<string, string> = {
    Confluence: "bg-blue-500/15 text-blue-300 border-blue-400/30",
    KB: "bg-indigo-500/15 text-indigo-300 border-indigo-400/30",
    SharePoint: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
    "Google Drive": "bg-yellow-500/15 text-yellow-300 border-yellow-400/30",
    Tools: "bg-yellow-300/15 text-yellow-100 border-yellow-600/30",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs ${colors[source] || "bg-neutral-700/30 text-neutral-200 border-neutral-600"}`}>
      <Globe className="h-3 w-3" /> {source}
    </span>
  );
}

function ResultCard({
  doc, bookmarked, onToggleBookmark, expanded, onToggle, navigate,
}: {
  doc: any; bookmarked: boolean; onToggleBookmark: () => void; expanded: boolean; onToggle: () => void; navigate: any;
}) {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-4 hover:bg-neutral-900 transition-colors">
      <button onClick={onToggle} className="w-full text-left" aria-expanded={expanded} title="Open details">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg font-semibold hover:underline">{doc.title}</span>
              <SourceBadge source={doc.source} />
            </div>
            <p className="text-sm text-neutral-300 line-clamp-2">{doc.content_excerpt}</p>
            <div className="mt-2 text-xs text-neutral-400">Last verified: {formatDate(doc.last_verified)} • Owner: {doc.owner}</div>
          </div>
          <button
            className="shrink-0 rounded-xl border border-neutral-700 p-2 hover:bg-neutral-800"
            onClick={(e) => { e.stopPropagation(); onToggleBookmark(); }}
            aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
            title={bookmarked ? "Remove bookmark" : "Add bookmark"}
          >
            {bookmarked ? <Star className="h-5 w-5 text-yellow-300" fill="currentColor" /> : <StarOff className="h-5 w-5" />}
          </button>
        </div>
      </button>

      {expanded && (
        <div className="mt-3 flex justify-end gap-2">
          <a
            href={doc.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="rounded-lg border border-neutral-700 px-3 py-1.5 text-sm hover:bg-neutral-800 inline-flex items-center gap-2"
          >
            Access link
          </a>
          <button onClick={() => { navigate("/ipsosAi"); }} className="rounded-lg border border-neutral-700 px-3 py-1.5 text-sm hover:bg-neutral-800">
            Detail explanation
          </button>
        </div>
      )}
    </div>
  );
}



export default function SearchDashboard() {
  const {
    role,
    addCustomShortcut,
    removeCustomShortcut,
    bookmarks,
    setBookmarks,
  } = useUserInformationContext();

  const [query, setQuery] = useState("");
  const [onlyVerified] = useState(false);
  const [sourceFilters, setSourceFilters] = useState<string[]>([]);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
 
  const navigate = useNavigate();

  const filters = useMemo(() => ({ onlyVerified, sources: sourceFilters }), [onlyVerified, sourceFilters]);
  const ranked = useMemo(() => {
    const scored = DOCS.map((d) => ({ doc: d, s: scoreDoc(d, query, role, filters) })).filter((x) => x.s > -50);
    scored.sort((a, b) => b.s - a.s);
    return scored;
  }, [query, role, filters]);

  function toggleSource(src: string) {
    setSourceFilters((prev) => prev.includes(src) ? prev.filter((s) => s !== src) : [...prev, src]);
  }

  function toggleFavoriteFromResult(doc: any) {
    const was = bookmarks.has(doc.id);
    if (was) {
      setBookmarks((prev) => { const n = new Set(prev); n.delete(doc.id); return n; });
      removeCustomShortcut(doc.id);
    } else {
      setBookmarks((prev) => new Set(prev).add(doc.id));
      addCustomShortcut({ label: doc.title, href: doc.url, isCustom: true, docId: doc.id });
    }
  }

  


  const toggleExpanded = (id: string) =>
    setExpandedIds((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-3">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 w-full rounded-xl border border-neutral-800 px-3 py-2 bg-neutral-950/60">
              <Search className="h-5 w-5 text-neutral-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search across Confluence, KB, SharePoint, Google Drive…"
                className="w-full bg-transparent outline-none placeholder:text-neutral-500"
              />
              <button className="rounded-lg border border-neutral-700 px-3 py-1.5 hover:bg-neutral-800 text-sm">Search</button>
            </div>
            <button className="rounded-xl border border-neutral-800 px-3 py-2 flex items-center gap-2 hover:bg-neutral-900">
              <Filter className="h-4 w-4" /> Filters
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {SOURCES.map((s) => (
              <button
                key={s}
                onClick={() => toggleSource(s)}
                className={`text-xs rounded-full border px-2 py-1 ${sourceFilters.includes(s) ? "border-emerald-500 text-emerald-300 bg-emerald-500/10" : "border-neutral-700 text-neutral-300 hover:bg-neutral-800"}`}
              >
                {s}
              </button>
            ))}
            {sourceFilters.length > 0 && (
              <button onClick={() => setSourceFilters([])} className="text-xs underline opacity-80 hover:opacity-100">Clear</button>
            )}
          </div>
        </div>
      </div>


      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">Results ({ranked.length})</div>
          <div className="text-xs text-neutral-400">Sorted by relevance • Role: {role}</div>
        </div>
        <div className="mt-2 rounded-lg border border-neutral-800 bg-neutral-950/40 p-2">
          <div className="flex items-center gap-1 text-[11px] text-neutral-400 mb-1"><Sparkles className="h-3.5 w-3.5" /> Quick summary</div>
          <p className="text-xs text-neutral-300 line-clamp-5">
           <h1>Q’re template and IIS recommendations to be used: </h1>
           <br/>
            •IIS must receive Final approved and complete materials<br/>
            •Differentiate programming instructions using colour, bold, CAPS or [brackets]<br/>
            •Programming instructions need to be in English, for both English and translated questionnaires<br/>
            •Routing instructions: logical and clear; refer to question numbers and codes<br/>
            •All screening conditions: placed at the beginning of the questionnaire (all questions we need to apply quotas on, should be in the screener part)<br/>
            •All requested changes should be marked in the Word q’re using a different color and all changes should be included in the Quality Change Form<br/>
            •The changes should be sent in batches<br/>
            •If the batches of changes requested exceed our buffer (of 3 hours free of charge changes) extra costs will incur. PM will inform RE about this in advance.<br/>
            •All teams working on P&G studies must complete the P&G Stewardship Training once a year<br/>
          </p>
        </div>

  
        <div className="space-y-3">
          {ranked.map(({ doc }) => (
            <ResultCard
              key={doc.id}
              doc={doc}
              bookmarked={bookmarks.has(doc.id)}
              onToggleBookmark={() => toggleFavoriteFromResult(doc)}
              expanded={expandedIds.has(doc.id)}
              onToggle={() => toggleExpanded(doc.id)}
              navigate={navigate}
            />
          ))}
        </div>

        {ranked.length === 0 && (
          <div className="rounded-xl border border-neutral-800 p-6 text-sm text-neutral-300">
            <div className="font-semibold mb-2">No results with current filters.</div>
            <div className="mb-2">Try one of these queries or ask the assistant:</div>
            <div className="flex flex-wrap gap-2">
              {noResultSuggestions.map((s, i) => (
                <button key={i} onClick={() => { setQuery(s); setAssistantOpen(true); }} className="text-xs rounded-full border border-neutral-700 px-2 py-1 hover:bg-neutral-800">{s}</button>
              ))}
            </div>
          </div>
        )}
      </section>

      
    </div>
  );
}
