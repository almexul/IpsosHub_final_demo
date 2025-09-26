import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CalendarDays, MapPin, Newspaper, ThumbsUp, X, EllipsisVertical } from "lucide-react";


export type NewsSource = "ipsos" | "yammer";
export interface NewsItem {
  id: string;
  source: NewsSource;
  title: string;
  summary: string;
  dateISO: string;
  link?: string;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  dateISO: string;
  location: string;
  votesTakePart?: number;
  votesNotInterested?: number;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export function classesForButton(kind: "take" | "no", selected: boolean) {
  const base = "rounded-xl border-white/10";
  if (kind === "take") {
    return selected
      ? `${base} bg-blue-700 text-white`
      : `${base} bg-blue-900 text-white hover:bg-blue-800`;
  }
  
  return selected
    ? `${base} bg-blue-700/90 text-white`
    : `${base} bg-blue-950/80 text-white hover:bg-blue-900`;
}

const NEWS: NewsItem[] = [
  {
    id: "n1",
    source: "ipsos",
    title: "Message from Jean Laurent Poitou, Ipsos CEO",
    summary: "Today, I am joining Ipsos as your Chief Executive Officer. I’m delighted, honored and humbled to serve this extraordinary company.",
    dateISO: "2025-10-02",
    link: "#",
  },
  {
    id: "n2",
    source: "ipsos",
    title: "Fieldwork best practices – October refresher",
    summary: "Guidelines for quota setup, translation checks.",
    dateISO: "2025-10-06",
    link: "#",
  },
  {
    id: "n3",
    source: "yammer",
    title: "Team volunteering day – sign up!",
    summary: "Join the Bucharest crew for the city clean-up. Lunch covered.",
    dateISO: "2025-10-08",
    link: "#",
  },
  {
    id: "n4",
    source: "yammer",
    title: "Photos from last week’s meetup",
    summary: "Slides, demos, and the recording are now available.",
    dateISO: "2025-10-03",
    link: "#",
  },
];

const EVENTS: EventItem[] = [
  {
    id: "e1",
    title: "Party – Bucharest",
    description: "Casual office party with music and snacks.",
    dateISO: "2025-09-25",
    location: "Bucharest HQ",
    votesTakePart: 12,
    votesNotInterested: 3,
  },
  {
    id: "e2",
    title: "Cooking for Life",
    description: "Charity cooking workshop; all proceeds donated.",
    dateISO: "2025-09-29",
    location: "Kitchens United, Sector 3",
    votesTakePart: 7,
    votesNotInterested: 1,
  },
  {
    id: "e3",
    title: "Hackathon",
    description: "24h build – AI helpers, dashboards, and more.",
    dateISO: "2025-10-09",
    location: "Innovation Lab",
    votesTakePart: 18,
    votesNotInterested: 2,
  },
  {
    id: "e4",
    title: "Behind the scene with Sam Scot",
    description: "Fireside chat and product deep-dive.",
    dateISO: "2025-10-14",
    location: "Auditorium A",
    votesTakePart: 10,
    votesNotInterested: 4,
  },
];


function NewsCard({ item }: { item: NewsItem }) {
  return (
    <Card className="border-white/10 bg-white/5">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-white/90 text-base md:text-lg">{item.title}</CardTitle>
          <Badge variant="secondary" className="bg-black/60 text-white">
            {item.source === "ipsos" ? "Ipsos" : "Yammer"}
          </Badge>
        </div>
        <CardDescription className="text-white/60 flex items-center gap-2">
          <CalendarDays className="h-4 w-4" /> {formatDate(item.dateISO)}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-white/80">{item.summary}</p>
        {item.link && (
          <div className="mt-3">
            <Button asChild size="sm" className="rounded-xl bg-blue-400 text-black hover:brightness-105">
              <a href={item.link}>Open</a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function VoteBar({ take, notInt }: { take: number; notInt: number }) {
  const total = Math.max(1, take + notInt);
  const takePct = Math.round((take / total) * 100);
  const notPct = 100 - takePct;
  return (
    <div className="mt-3 w-full overflow-hidden rounded-lg border border-white/10">
      <div className="flex h-2 w-full">
        <div style={{ width: `${takePct}%` }} className="bg-green-500" />
        <div style={{ width: `${notPct}%` }} className="bg-red-500" />
      </div>
      <div className="flex justify-between p-1 text-xs text-white/70">
        <span>
          Take part: {take} ({takePct}%)
        </span>
        <span>
          Not interested: {notInt} ({notPct}%)
        </span>
      </div>
    </div>
  );
}

function EventCard({
  item,
  onVote,
  myVote,
}: {
  item: EventItem;
  onVote: (id: string, v: "take" | "no") => void;
  myVote?: "take" | "no" | null;
}) {
  const take = (item.votesTakePart ?? 0) + (myVote === "take" ? 1 : 0);
  const notInt = (item.votesNotInterested ?? 0) + (myVote === "no" ? 1 : 0);

  return (
    <Card className="border-white/10 bg-white/5">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-white/90 text-base md:text-lg">{item.title}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/10">
                <EllipsisVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="border-white/10 bg-zinc-900 text-white">
              <DropdownMenuItem disabled>Export participants (Excel)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription className="text-white/60 flex flex-wrap items-center gap-4">
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="h-4 w-4" /> {formatDate(item.dateISO)}
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-4 w-4" /> {item.location}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-white/80">{item.description}</p>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Button
            variant="secondary"
            onClick={() => onVote(item.id, "take")}
            className={classesForButton("take", myVote === "take")}
          >
            <ThumbsUp className="mr-1 h-4 w-4" /> Take part
          </Button>
          <Button
            variant="secondary"
            onClick={() => onVote(item.id, "no")}
            className={classesForButton("no", myVote === "no")}
          >
            <X className="mr-1 h-4 w-4" /> Not interested
          </Button>
        </div>

        <VoteBar take={take} notInt={notInt} />
      </CardContent>
    </Card>
  );
}


export default function NewsEventsPage() {
  const [activeNewsTab, setActiveNewsTab] = useState<NewsSource>("ipsos");
  const [votes, setVotes] = useState<Record<string, "take" | "no" | null>>({});

  const ipsosNews = useMemo(() => NEWS.filter((n) => n.source === "ipsos"), []);
  const yammerNews = useMemo(() => NEWS.filter((n) => n.source === "yammer"), []);

  function handleVote(id: string, v: "take" | "no") {
    setVotes((s) => ({ ...s, [id]: s[id] === v ? null : v }));
  }

  return (
    <div className="min-h-screen w-full bg-[#090909] p-4 text-white">
 
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div className="flex items-center gap-2 text-2xl font-semibold md:text-3xl">
          <Newspaper className="h-6 w-6 text-white" /> News & Events
        </div>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white/90">News</h2>
          </div>

          <Tabs value={activeNewsTab} onValueChange={(v) => setActiveNewsTab(v as NewsSource)} className="w-full">
            <TabsList className="bg-blue-400">
              <TabsTrigger className="blue-400" value="ipsos">News by Ipsos</TabsTrigger>
              <TabsTrigger value="yammer">Yammer</TabsTrigger>
            </TabsList>
            <TabsContent value="ipsos" className="mt-4 grid gap-4 md:grid-cols-2">
              {ipsosNews.map((n) => (
                <NewsCard key={n.id} item={n} />
              ))}
            </TabsContent>
            <TabsContent value="yammer" className="mt-4 grid gap-4 md:grid-cols-2">
              {yammerNews.map((n) => (
                <NewsCard key={n.id} item={n} />
              ))}
            </TabsContent>
          </Tabs>
        </section>


        <section className="mt-8">
          <h2 className="mb-3 text-xl font-semibold text-white/90">Events</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {EVENTS.map((e) => (
              <EventCard key={e.id} item={e} myVote={votes[e.id]} onVote={handleVote} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
