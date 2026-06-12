"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Github,
  Linkedin,
  Mail,
  User,
  Briefcase,
  Code2,
  FolderOpen,
  Phone,
  Hammer,
  GitMerge,
  Sparkles,
  BookOpen,
  Trophy,
} from "lucide-react";

const navItems = [
  { id: "about", label: "About", icon: User },
  { id: "building", label: "Building", icon: Hammer },
  { id: "projects", label: "Projects", icon: FolderOpen },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "awards", label: "Awards", icon: Trophy },
  { id: "oss", label: "Open Source", icon: GitMerge },
  { id: "notes", label: "Eng. Notes", icon: BookOpen },
  { id: "skills", label: "Skills", icon: Code2 },
  { id: "interests", label: "Interests", icon: Sparkles },
  { id: "contact", label: "Contact", icon: Phone },
];

export default function Sidebar() {
  const [active, setActive] = useState("about");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -65% 0px" }
    );
    navItems.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setActive(id);
    setMenuOpen(false);
  };

  return (
    <>
      {/* Desktop sidebar — w-64 */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 border-r border-border bg-surface/75 backdrop-blur-md flex-col p-7 z-40">
        {/* Avatar + name */}
        <div className="mb-8">
          <div className="w-24 h-24 rounded-full overflow-hidden mb-4 ring-1 ring-border transition-all duration-500 hover:ring-green/60 hover:shadow-[0_0_24px_-4px_rgba(74,222,128,0.4)]">
            <Image
              src="/profile.jpeg"
              alt="Aadith S"
              width={96}
              height={96}
              className="object-cover w-full h-full"
              unoptimized
            />
          </div>
          <p className="text-base font-semibold text-text leading-snug mb-0.5">
            Aadith S
          </p>
          <p className="text-sm text-subtle mb-2">Backend Engineer</p>
          <p className="text-xs text-muted leading-relaxed">
            Currently&nbsp;@&nbsp;<span className="text-subtle">Unifize</span>
          </p>
          <p className="text-xs text-muted leading-relaxed mb-2">
            Previously&nbsp;@&nbsp;<span className="text-subtle">Infra.Market</span>
          </p>
          <p className="text-xs text-muted leading-relaxed">
            Go&nbsp;•&nbsp;Distributed Systems&nbsp;•&nbsp;Data Engineering
          </p>
        </div>

        {/* Social icons */}
        <div className="flex items-center gap-4 mb-8">
          <a
            href="https://www.linkedin.com/in/aadith-suresh/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-text transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin size={16} />
          </a>
          <a
            href="https://github.com/AadithS13"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-text transition-colors"
            aria-label="GitHub"
          >
            <Github size={16} />
          </a>
          <a
            href="mailto:aadithsuresh10@gmail.com"
            className="text-muted hover:text-text transition-colors"
            aria-label="Email"
          >
            <Mail size={16} />
          </a>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-0.5">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm w-full text-left transition-all duration-200 ${
                active === id
                  ? "bg-border text-text translate-x-1"
                  : "text-muted hover:text-subtle hover:bg-border/40 hover:translate-x-1"
              }`}
            >
              <Icon size={14} className="flex-shrink-0" />
              {label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 h-12 border-b border-border bg-surface/95 backdrop-blur-sm px-5 flex items-center justify-between">
        <span className="text-sm font-semibold text-text">Aadith S</span>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-xs font-mono text-muted"
        >
          {menuOpen ? "close" : "menu"}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden fixed top-12 left-0 right-0 z-40 bg-surface border-b border-border">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="flex items-center gap-3 w-full text-left text-sm text-subtle px-5 py-3 border-b border-border last:border-0 hover:text-text transition-colors"
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
