import React, { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";


export type Provider = "ipsos-ai" | "openai" | "gemini";

export function resolveProvider(selected: Provider | ""): Provider {
  return (selected || "ipsos-ai") as Provider;
}


export default function SearchLanding() {
  const [query, setQuery] = useState("");
  const [provider, setProvider] = useState<Provider | "">("");

  const canSubmit = useMemo(() => query.trim().length > 0, [query]);
 const navigate = useNavigate(); 
  function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!canSubmit) return;

    const chosenProvider = resolveProvider(provider);
    console.log({ query, provider: chosenProvider });
  }

  return (
    <div className="min-h-screen w-full bg-[#090909] text-white">
 
      <main className="mx-auto h-lvh flex max-w-5xl flex-col items-center justify-center px-4 pb-24 pt-12 md:pt-20">
        <h1 className="mb-8 flex items-center gap-2 text-center text-3xl font-semibold tracking-tight md:text-4xl">
          What can I help with?
          <Sparkles className="h-6 w-6 text-blue-400" />
        </h1>

        <Card className="w-full border-white/10 bg-white/5 shadow-xl backdrop-blur">
          <CardContent className="p-2 sm:p-4">
            <form onSubmit={handleSubmit} className="flex items-center gap-2 sm:gap-3">

              <div className="relative w-full">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Write what you need to find…"
                  className="h-14 w-full rounded-2xl border-white/10 bg-black/60 pl-4 pr-4 text-base text-white placeholder:text-white/50 "
                />
              </div>

              <Select value={provider} onValueChange={(v) => setProvider(v as Provider)}>
                <SelectTrigger className="h-14 w-1xl rounded-2xl border-white/10 bg-black/60 px-4 text-white focus:ring-yellow-400/60 whitespace-nowrap">
                  <SelectValue placeholder="Extend your search" />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-zinc-900 text-white focus:ring-yellow-400/60 whitespace-nowrap">
                  <SelectItem value="ipsos-ai">Ipsos AI</SelectItem>
                  <SelectItem value="openai">OpenAI</SelectItem>
                  <SelectItem value="gemini">Gemini</SelectItem>
                </SelectContent>
              </Select>

              <Button
                type="submit"
                size="icon"
                className="h-14 wcanSubmit-14 rounded-full bg-rose-600 text-black transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
                 onClick={()=>{navigate("/searchDasboard")}}
              >
                <ArrowRight className="h-5 w-5"  />
              </Button>
            </form>
          </CardContent>
        </Card>

       

        <p className="mt-10 text-center text-sm text-white/50">
          Tip: press <kbd className="rounded bg-white/10 px-1">Enter</kbd> to search.
        </p>
      </main>

      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(600px_200px_at_50%_20%,rgba(253,224,71,0.10),transparent),radial-gradient(400px_150px_at_80%_60%,rgba(253,224,71,0.06),transparent)]"
      />
    </div>
  );
}
