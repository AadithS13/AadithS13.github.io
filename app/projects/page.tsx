import { ArrowUpRight, Github } from "lucide-react";

const projects = [
  {
    slug: "flow-orchestrator",
    name: "FlowOrchestrator",
    tagline: "Kafka-based async workflow orchestration engine in Go",
    description:
      "A production-grade workflow orchestration engine built on Apache Kafka. Handles multi-step async workflows with idempotent execution, dead-letter queues, retry logic, and real-time observability via Prometheus and Grafana dashboards.",
    tags: ["Go", "Kafka", "Prometheus", "Grafana", "Docker", "PostgreSQL"],
    github: "https://github.com/AadithS13/FlowOrchestrator",
    highlights: [
      "RETRYING_PAYMENT state machine with configurable backoff",
      "Idempotency keys scoped per attempt to allow genuine retries",
      "Load-tested end-to-end with automated scripts",
      "Grafana + Prometheus observability stack included",
    ],
  },
  {
    slug: "infra-lens",
    name: "InfraLens",
    tagline: "Infrastructure monitoring and observability CLI tool",
    description:
      "A developer-focused CLI tool for real-time infrastructure monitoring. Surfaces key metrics, log aggregation, and system health checks in a clean terminal interface — built for engineers who live in the terminal.",
    tags: ["Go", "CLI", "Observability", "Metrics"],
    github: "https://github.com/AadithS13/InfraLens",
    highlights: [
      "Real-time metric polling with configurable intervals",
      "Log aggregation across multiple services",
      "Minimal dependency footprint",
      "Designed for local dev and staging environments",
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

      <div className="space-y-px">
        {projects.map((project) => (
          <div
            key={project.slug}
            className="group border border-border rounded-lg p-6 hover:border-muted transition-colors bg-surface"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <h2 className="text-lg font-semibold text-text group-hover:text-white transition-colors">
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
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-mono text-muted border border-border px-2 py-0.5 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Placeholder for more projects */}
      <div className="mt-8 border border-dashed border-border rounded-lg p-6 text-center">
        <p className="text-xs text-muted font-mono">more projects coming soon</p>
      </div>
    </div>
  );
}
