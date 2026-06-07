import Image from "next/image";
import { Github } from "lucide-react";

const projects = [
  {
    slug: "infra-lens",
    name: "InfraLens",
    emoji: "🚀",
    tagline: "Construction intelligence platform — reverse-engineered APIs, incremental crawling, snapshot diffing",
    description:
      "Reverse-engineers MahaRERA APIs, performs incremental synchronization, tracks project-level changes through snapshot diffing, and exposes search APIs over normalized real-estate data.",
    stack: ["Go", "PostgreSQL", "Docker", "REST APIs", "Cron", "Data Engineering"],
    github: "https://github.com/AadithS13/InfraLens",
    image: "/projects/infralens-crawler.png",
    imageAlt: "InfraLens crawler interface",
    highlights: [
      "Reverse-engineered undocumented MahaRERA APIs for incremental data sync",
      "Snapshot diffing to detect and track project-level changes over time",
      "Normalized real-estate data exposed through clean search APIs",
      "Cron-driven pipeline with idempotent crawl and deduplication logic",
    ],
  },
  {
    slug: "flow-orchestrator",
    name: "FlowOrchestrator",
    emoji: "⚙️",
    tagline: "Distributed Kafka workflow engine with retries, DLQ, idempotency, and observability",
    description:
      "Distributed workflow orchestration platform built with Kafka and Go, featuring retries, DLQ handling, idempotent processing, observability, and fault-tolerant order workflows.",
    stack: ["Go", "Kafka", "PostgreSQL", "Prometheus", "Grafana", "Docker"],
    github: "https://github.com/AadithS13/FlowOrchestrator",
    image: "/projects/floworchestrator-grafana.png",
    imageAlt: "FlowOrchestrator Grafana dashboard",
    highlights: [
      "Kafka-based async state machine with RETRYING_PAYMENT and DLQ states",
      "Idempotency keys scoped per attempt to allow genuine retries",
      "Prometheus metrics + Grafana dashboard included out of the box",
      "Load-tested end-to-end with automated scripts",
    ],
  },
];

export default function Projects() {
  return (
    <div className="min-h-screen px-6 md:px-12 lg:px-24 max-w-4xl mx-auto pt-28 pb-20">
      <div className="mb-12">
        <p className="text-xs font-mono text-muted uppercase tracking-widest mb-3">
          Work
        </p>
        <h1 className="text-3xl font-semibold text-text">Projects</h1>
        <p className="text-subtle mt-2 text-sm">
          Things I've built — mostly backend, mostly open source.
        </p>
      </div>

      <div className="space-y-6">
        {projects.map((project) => (
          <div
            key={project.slug}
            className="group border border-border rounded-lg overflow-hidden bg-surface hover:border-muted transition-colors"
          >
            {/* Screenshot */}
            <div className="relative w-full h-52 overflow-hidden bg-bg border-b border-border">
              <Image
                src={project.image}
                alt={project.imageAlt}
                fill
                className="object-cover object-top opacity-80 group-hover:opacity-100 transition-opacity"
                unoptimized
              />
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h2 className="text-lg font-semibold text-text flex items-center gap-2">
                    <span>{project.emoji}</span>
                    {project.name}
                  </h2>
                  <p className="text-sm text-subtle mt-0.5">{project.tagline}</p>
                </div>
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted hover:text-text transition-colors flex-shrink-0 mt-0.5"
                  aria-label={`${project.name} on GitHub`}
                >
                  <Github size={17} />
                </a>
              </div>

              <p className="text-sm text-subtle leading-relaxed mb-4">
                {project.description}
              </p>

              <ul className="space-y-1 mb-5">
                {project.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 text-xs text-subtle">
                    <span className="text-muted mt-0.5 flex-shrink-0">—</span>
                    {h}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-2">
                {project.stack.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-mono text-muted border border-border px-2 py-0.5 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 border border-dashed border-border rounded-lg p-6 text-center">
        <p className="text-xs text-muted font-mono">more projects coming soon</p>
      </div>
    </div>
  );
}
