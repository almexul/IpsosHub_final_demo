import { SearchIcon, LinkIcon, Bot, Newspaper, Settings2, User, LogOut, CalendarDays, MapPin } from 'lucide-react';
import React from 'react'
import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

export default function HeroSectionPageLayout() {
     const [role, setRole] = useState<string>("SW");
      const [user, setUser] = useState<UserInfo>({ name: "Alexandru Paval", email: "Alexandru.Paval@ipsos.com" });
    const navLinkClass ="rounded-xl border border-neutral-800 px-3 py-2 text-sm hover:bg-neutral-900 transition-colors flex items-center gap-2";
    const ROLE_OPTIONS = ["SW", "PM", "RD", "QA", "IT"];
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

    <Outlet />


    
      <div className="border-t border-neutral-800 py-6 text-center text-xs text-neutral-500">
        Hackathon Demo • Centralized, Role-based Knowledge Hub
      </div>
    </div>
  );
}
