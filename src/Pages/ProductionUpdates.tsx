import React, { useMemo, useState } from "react";
import {
  Info,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ExternalLink,
  Server,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { useUserInformationContext } from "../LayoutsOfThePages/MainLayout/PageLayout";


type Severity = "info" | "warning" | "incident";
type Status = "open" | "monitoring" | "resolved";
type Environment = "prod" | "staging" | "dev";
type Role = "SW" | "PM" | "QA" | "DP";

type ProdUpdate = {
  id: string;
  title: string;
  summary: string;
  severity: Severity;
  status: Status;
  environment: Environment;
  created_at: string; 
  window?: { start?: string; end?: string };
  roles: Role[];
  links?: { label: string; url: string }[];
  detailsByRole?: Partial<Record<Role, string>>; 
};


const SEVERITY_META: Record<Severity, { label: string; classes: string }> = {
  info: { label: "Info", classes: "border-blue-400/30 text-blue-300 bg-blue-500/10" },
  warning: { label: "Warning", classes: "border-yellow-400/30 text-yellow-300 bg-yellow-500/10" },
  incident: { label: "Incident", classes: "border-red-400/30 text-red-300 bg-red-500/10" },
};
const STATUS_META: Record<Status, { label: string; classes: string }> = {
  open: { label: "Open", classes: "border-emerald-400/30 text-emerald-300 bg-emerald-500/10" },
  monitoring: { label: "Monitoring", classes: "border-orange-400/30 text-orange-300 bg-orange-500/10" },
  resolved: { label: "Resolved", classes: "border-neutral-400/30 text-neutral-300 bg-neutral-500/10" },
};
const ENV_META: Record<Environment, { label: string; classes: string }> = {
  prod: { label: "Production", classes: "border-red-400/30 text-red-300 bg-red-500/10" },
  staging: { label: "Staging", classes: "border-purple-400/30 text-purple-300 bg-purple-500/10" },
  dev: { label: "Dev", classes: "border-neutral-400/30 text-neutral-300 bg-neutral-500/10" },
};


const timeAgo = (iso?: string) => {
  if (!iso) return "—";
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.max(0, Math.round(diff / 60000));
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return `${d}d ago`;
};


const MOCK_UPDATES: ProdUpdate[] = [
  {
    id: "u-sw-1",
    title: "Router Management – limited NA coverage",
    summary: "Planned work may cause limited coverage for Router Management in NA.",
    severity: "warning",
    status: "open",
    environment: "prod",
    created_at: "2025-09-24T08:30:00Z",
    window: { start: "2025-09-26T13:00:00Z", end: "2025-09-26T17:00:00Z" },
    roles: ["SW", "PM", "QA", "DP"],
    links: [{ label: "KB Article", url: "#" }],
    detailsByRole: {
      SW: "Developers: expect 2–5% job retries on NA jobs. Use backup POP toggles and avoid pushing heavy deployments during the window.",
      PM: "Project Managers: schedule fieldwork windows around the maintenance. Communicate risk to clients in NA.",
      QA: "QA: run sanity checks on Router-dependent test suites after 17:00 UTC.",
      DP: "DP: exports dependent on Router metrics may be delayed. Plan overnight re-runs if needed.",
    },
  },
  {
    id: "u-sw-2",
    title: "IIS Fish JSON Builder – hotfix",
    summary: "Fix for edge-case parsing when merging multilingual quotas.",
    severity: "info",
    status: "resolved",
    environment: "prod",
    created_at: "2025-09-22T15:00:00Z",
    roles: ["SW", "QA"],
    detailsByRole: {
      SW: "No action required. Update is live. If you cached schema v1.8, clear local caches and regenerate.",
      QA: "Regression focus: quota merge on multilanguage waves. See test plan TP-142.",
    },
  },
  {
    id: "u-pm-1",
    title: "SoW Template update",
    summary: "Added budget variance section and compliance checklist.",
    severity: "info",
    status: "open",
    environment: "prod",
    created_at: "2025-09-23T10:00:00Z",
    roles: ["PM"],
    detailsByRole: {
      PM: "Use v3.2 for all new SoW. For active SoW, append Annex B – Compliance. Template in KB/SoW-v3.2.",
    },
  },
  {
    id: "u-qa-2",
    title: "Testing queue delays",
    summary: "Higher latency observed in test runners between 18:00–20:00 UTC.",
    severity: "warning",
    status: "monitoring",
    environment: "dev",
    created_at: "2025-09-24T18:30:00Z",
    roles: ["QA"],
    detailsByRole: {
      QA: "Prefer local runners for heavy suites after 18:00 UTC. Report spikes > 2× baseline to #qa-status.",
    },
  },
  {
    id: "u-dp-2",
    title: "SPSS weights exporter",
    summary: "Added CSV fallback and separator autodetect.",
    severity: "info",
    status: "open",
    environment: "prod",
    created_at: "2025-09-25T07:50:00Z",
    roles: ["DP", "SW"],
    detailsByRole: {
      DP: "When CSV fallback triggers, validate decimal separator. New audit line in footer shows autodetected settings.",
      SW: "SDK consumers: new flag `--csv-fallback` available. Default off.",
    },
  },
];

function buildListForRole(role: Role, items: ProdUpdate[], limit = 2): ProdUpdate[] {
  return [...items]
    .filter((u) => u.roles.includes(role))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit);
}

function getRoleDetails(u: ProdUpdate, role: Role): string | undefined {
  return u.detailsByRole?.[role];
}


function Badge({ classes, children, title }: { classes: string; children: React.ReactNode; title?: string }) {
  return (
    <span title={title} className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs ${classes}`}>
      {children}
    </span>
  );
}

function ResultRow({ u, role, expanded, onToggle }: { u: ProdUpdate; role: Role; expanded: boolean; onToggle: () => void }) {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 hover:bg-neutral-900 transition-colors">
      <button onClick={onToggle} className="w-full text-left px-4 py-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-base font-semibold truncate">{u.title}</span>
                <Badge classes={SEVERITY_META[u.severity].classes}>{SEVERITY_META[u.severity].label}</Badge>
                <Badge classes={STATUS_META[u.status].classes}>{STATUS_META[u.status].label}</Badge>
                <Badge classes={ENV_META[u.environment].classes}>
                  <Server className="h-3.5 w-3.5" /> {ENV_META[u.environment].label}
                </Badge>
              </div>
              <p className="text-sm text-neutral-300 line-clamp-2 mt-1">{u.summary}</p>
              <div className="mt-1 text-[11px] text-neutral-400">{timeAgo(u.created_at)} • Roles: {u.roles.join(", ")}</div>
            </div>
            <div className="shrink-0 mt-0.5 text-neutral-400">{expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}</div>
          </div>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 -mt-1">
          <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-3">
            <div className="text-xs text-neutral-400 mb-1">
              Viewing details for role: <span className="text-neutral-200 font-medium">{role}</span>
            </div>
            <div className="text-sm text-neutral-200 whitespace-pre-line">
              {getRoleDetails(u, role) || "No role-specific notes. Use general summary above."}
            </div>

            <div className="mt-3 flex items-center gap-2 justify-end">
              {u.links?.[0] && (
                <a
                  href={u.links[0].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-neutral-700 px-3 py-1.5 text-sm hover:bg-neutral-800 inline-flex items-center gap-1"
                >
                  <ExternalLink className="h-4 w-4" /> Access link
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProductionUpdatesResultList({ role }: { role: Role }) {
  const list = useMemo(() => buildListForRole(role, MOCK_UPDATES, 2), [role]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const toggle = (id: string) => setExpandedId((cur) => (cur === id ? null : id));

  return (
    <div className="flex flex-col gap-3">
      {list.map((u) => (
        <ResultRow key={u.id} u={u} role={role} expanded={expandedId === u.id} onToggle={() => toggle(u.id)} />
      ))}
      {list.length === 0 && (
        <div className="rounded-xl border border-neutral-800 p-6 text-sm text-neutral-400">No updates for role {role}.</div>
      )}
    </div>
  );
}



export default function ProductionUpdates() {
  const { role } = useUserInformationContext(); 
  return (
    <div className="min-h-screen w-full bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
        <ProductionUpdatesResultList role={role as Role} />
        <div className="mt-6 text-[11px] text-neutral-500 flex flex-wrap gap-3">
          <span className="inline-flex items-center gap-1"><Info className="h-3.5 w-3.5" /> Info</span>
          <span className="inline-flex items-center gap-1"><AlertTriangle className="h-3.5 w-3.5" /> Warning</span>
          <span className="inline-flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> Resolved</span>
        </div>
      </div>
      <div className="border-t border-neutral-800 py-6 text-center text-xs text-neutral-500">
        Hackathon Demo • Centralized, Role-based Knowledge Hub
      </div>
    </div>
  );
}
