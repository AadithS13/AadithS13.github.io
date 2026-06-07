import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Github, Mail, Linkedin } from "lucide-react";

const featured = [
  {
    name: "InfraLens",
    emoji: "🚀",
    tagline:
      "Construction intelligence platform with incremental crawling, change detection, historical tracking, and search APIs.",
    description:
      "Reverse-engineers MahaRERA APIs, performs incremental synchronization, tracks project-level changes through snapshot diffing, and exposes search APIs over normalized real-estate data.",
    stack: ["Go", "PostgreSQL", "Docker", "REST APIs", "Cron", "Data Engineering"],
    github: "https://github.com/AadithS13/InfraLens",
    image: "/projects/infralens-crawler.png",
    imageAlt: "InfraLens crawler interface",
  },
  {
    name: "FlowOrchestrator",
    emoji: "⚙️",
    tagline:
      "Kafka-powered workflow engine with retries, DLQ processing, idempotency, and production-grade observability.",
    description:
      "Distributed workflow orchestration platform built with Kafka and Go, featuring retries, DLQ handling, idempotent processing, observability, and fault-tolerant order workflows.",
    stack: ["Go", "Kafka", "PostgreSQL", "Prometheus", "Grafana", "Docker"],
    github: "https://github.com/AadithS13/FlowOrchestrator",
    image: "/projects/floworchestrator-grafana.png",
    imageAlt: "FlowOrchestrator Grafana dashboard",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen px-6 md:px-12 lg:px-24 max-w-4xl mx-auto pt-24 pb-16">
      {/* Hero — kept tight so projects are visible above fold */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-5">
          <span className="w-2 h-2 rounded-full bg-green inline-block animate-pulse" />
          <span className="text-xs font-mono text-subtle tracking-widest uppercase">
            Open to opportunities
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-text mb-2 leading-tight">
          Aadith S
        </h1>
        <p className="text-lg text-subtle font-light mb-4">
          Backend Software Engineer
        </p>
        <p className="text-sm text-subtle leading-relaxed max-w-xl mb-6">
          ~3 years building event-driven microservices at{" "}
          <span className="text-text">Infra.Market</span>. Go, Kafka,
          PostgreSQL.
        </p>

        <div className="flex items-center gap-5">
          <a
            href="https://github.com/AadithS13"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-text transition-colors"
            aria-label="GitHub"
          >
            <Github size={17} />
          </a>
          <a
            href="mailto:aadithsuresh10@gmail.com"
            className="text-muted hover:text-text transition-colors"
            aria-label="Email"
          >
            <Mail size={17} />
          </a>
          <a
            href="https://linkedin.com/in/aadith-s"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-text transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin size={17} />
          </a>
          <Link
            href="/experience"
            className="ml-2 text-xs font-mono text-muted hover:text-text transition-colors border border-border px-3 py-1.5 rounded"
          >
            experience ↗
          </Link>
          <Link
            href="/contact"
            className="text-xs font-mono text-muted hover:text-text transition-colors border border-border px-3 py-1.5 rounded"
          >
            contact ↗
          </Link>
        </div>
      </div>

      {/* Featured Projects */}
      <div>
        <p className="text-xs font-mono text-muted uppercase tracking-widest mb-5">
          Featured Projects
        </p>

        <div className="space-y-4">
          {featured.map((project) => (
            <div
              key={project.name}
              className="group border border-border rounded-lg overflow-hidden bg-surface hover:border-muted transition-colors"
            >
              {/* Screenshot */}
              <div className="relative w-full h-44 overflow-hidden bg-bg border-b border-border">
                <Image
                  src={project.image}
                  alt={project.imageAlt}
                  fill
                  className="object-cover object-top opacity-80 group-hover:opacity-100 transition-opacity"
                  unoptimized
                />
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h2 className="text-base font-semibold text-text flex items-center gap-2">
                      <span>{project.emoji}</span> {project.name}
                    </h2>
                    <p className="text-sm text-subtle mt-0.5 leading-snug">
                      {project.tagline}
                    </p>
                  </div>
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted hover:text-text transition-colors flex-shrink-0 mt-0.5"
                    aria-label={`${project.name} on GitHub`}
                  >
                    <Github size={16} />
                  </a>
                </div>

                <p className="text-xs text-muted leading-relaxed mb-4">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {project.stack.map((t) => (
                    <span
                      key={t}
                      className="text-xs font-mono text-muted border border-border px-2 py-0.5 rounded"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 flex justify-end">
          <Link
            href="/projects"
            className="flex items-center gap-1 text-xs font-mono text-muted hover:text-text transition-colors"
          >
            all projects <ArrowUpRight size={12} />
          </Link>
        </div>
      </div>

      {/* Stack strip */}
      <div className="mt-14 pt-8 border-t border-border">
        <p className="text-xs font-mono text-muted uppercase tracking-widest mb-4">
          Stack
        </p>
        <div className="flex flex-wrap gap-2">
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
