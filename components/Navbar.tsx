"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "home" },
  { href: "/projects", label: "projects" },
  { href: "/experience", label: "experience" },
  { href: "/contact", label: "contact" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-bg/90 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto px-6 md:px-12 lg:px-24 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="text-xs font-mono text-muted hover:text-text transition-colors tracking-wider"
        >
          aadith.s
        </Link>

        <div className="flex items-center gap-1">
          {navLinks.map(({ href, label }) => {
            const isActive =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`text-xs font-mono px-3 py-1.5 rounded transition-colors ${
                  isActive
                    ? "text-text bg-surface"
                    : "text-muted hover:text-subtle"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
