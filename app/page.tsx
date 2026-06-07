import Link from "next/link";
import { ArrowUpRight, Github, Mail, Linkedin } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-24 max-w-4xl mx-auto pt-24 pb-16">
      {/* Status pill */}
      <div className="flex items-center gap-2 mb-8">
        <span className="w-2 h-2 rounded-full bg-green inline-block animate-pulse" />
        <span className="text-xs font-mono text-subtle tracking-widest uppercase">
          Open to opportunities
        </span>
      </div>

      {/* Hero */}
      <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-text mb-4 leading-tight">
        Aadith S
      </h1>
      <p className="text-xl md:text-2xl text-subtle font-light mb-6">
        Backend Software Engineer
      </p>
      <p className="text-base text-subtle leading-relaxed max-w-2xl mb-10">
        ~3 years building event-driven microservices at{" "}
        <span className="text-text">Infra.Market</span>. Focused on data
        integrity, system reliability, and things that scale. Primarily working
        in{" "}
        <span className="font-mono text-sm text-text">Go</span>,{" "}
        <span className="font-mono text-sm text-text">Kafka</span>, and{" "}
        <span className="font-mono text-sm text-text">PostgreSQL</span>.
      </p>

      {/* CTA links */}
      <div className="flex flex-wrap gap-4 mb-16">
        <Link
          href="/projects"
          className="flex items-center gap-1.5 text-sm border border-border px-4 py-2 rounded hover:border-muted transition-colors"
        >
          View Projects <ArrowUpRight size={14} />
        </Link>
        <Link
          href="/experience"
          className="flex items-center gap-1.5 text-sm text-subtle hover:text-text transition-colors px-4 py-2"
        >
          Experience <ArrowUpRight size={14} />
        </Link>
        <Link
          href="/contact"
          className="flex items-center gap-1.5 text-sm text-subtle hover:text-text transition-colors px-4 py-2"
        >
          Contact <ArrowUpRight size={14} />
        </Link>
      </div>

      {/* Social links */}
      <div className="flex items-center gap-6">
        <a
          href="https://github.com/AadithS13"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted hover:text-text transition-colors"
          aria-label="GitHub"
        >
          <Github size={18} />
        </a>
        <a
          href="mailto:aadithsuresh10@gmail.com"
          className="text-muted hover:text-text transition-colors"
          aria-label="Email"
        >
          <Mail size={18} />
        </a>
        <a
          href="https://linkedin.com/in/aadith-s"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted hover:text-text transition-colors"
          aria-label="LinkedIn"
        >
          <Linkedin size={18} />
        </a>
      </div>

      {/* Tech stack strip */}
      <div className="mt-20 pt-8 border-t border-border">
        <p className="text-xs font-mono text-muted uppercase tracking-widest mb-4">
          Stack
        </p>
        <div className="flex flex-wrap gap-3">
          {[
            "Go",
            "TypeScript",
            "Apache Kafka",
            "PostgreSQL",
            "gRPC",
            "Docker",
            "Grafana",
            "GoCD",
          ].map((tech) => (
            <span
              key={tech}
              className="text-xs font-mono text-subtle border border-border px-2.5 py-1 rounded"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
