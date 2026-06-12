import Image from "next/image";
import Link from "next/link";
import { Github, Mail, Linkedin, MapPin, ArrowUpRight, BookOpen } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Reveal from "@/components/Reveal";
import GlowCard from "@/components/GlowCard";

/* ─── Data ───────────────────────────────────────────────────── */

const experience = [
  {
    role: "Software Engineer 2",
    company: "Infra.Market",
    period: "Apr 2024 — Jun 2026",
    location: "Bangalore, India",
    items: [
      {
        heading: "Deal Mining Flow",
        body: "TDD author & lead — ingested RERA and external data sources, built automated pipeline to generate leads, identify new customers, infer project stage, and assign cross-sell deals to BU sales officers. +15% lead generation, +5–10% deal conversion.",
      },
      {
        heading: "KYC Deduplication",
        body: "TDD author & cross-team lead — Kafka-orchestrated multi-service flow covering GST/PAN-based duplicate prevention, nudging during creation, and a merge-with-verified-parent flow. Reduced duplicates by 35% and improved reporting accuracy by 25%.",
      },
      {
        heading: "Site Deduplication",
        body: "TDD author & lead — three-layer strategy: prevention via existing-site lookup at creation, pincode-matched nudging to surface similar sites, and geocode-based bulk data cleanup. Cut address duplicates by 30%.",
      },
    ],
  },
  {
    role: "Software Engineer",
    company: "Infra.Market",
    period: "Jul 2023 — Mar 2024",
    location: "Chennai, India",
    items: [
      {
        heading: "People Entity Framework",
        body: "Built a persona-based schema with role-access model that onboarded 1M+ active users across the platform.",
      },
      {
        heading: "Internal CRM",
        body: "Core contributor to building the company's internal CRM from the ground up. Integrated with Microsoft Dynamics ERP for financial data sync.",
      },
      {
        heading: "Ozonetel CTI Integration",
        body: "Integrated Ozonetel CTI calling platform into the CRM, enabling in-app click-to-call, call logging, and sales activity tracking for the field sales team.",
      },
    ],
  },
  {
    role: "Software Engineering Intern",
    company: "Infra.Market",
    period: "Feb 2023 — Jun 2023",
    location: "Hyderabad, India",
    items: [
      {
        heading: "Customer Service Revamp",
        body: "Led revamp of legacy Customer Service codebase — audited and updated deprecated APIs, created new endpoints, ensured backward compatibility, and completed schema migrations.",
      },
      {
        heading: "Stack",
        body: "Acquired proficiency in Golang and TypeScript through hands-on production work.",
      },
    ],
  },
];

const skills: Record<string, string[]> = {
  "Languages": ["Go (Golang)", "TypeScript", "Python"],
  "Messaging & APIs": ["Apache Kafka", "gRPC", "RESTful APIs", "JWT"],
  "Databases": ["PostgreSQL", "MySQL"],
  "System Design": ["Event-driven architecture", "Microservices", "Deduplication systems", "TDD authorship"],
  "Observability": ["Grafana", "Prometheus", "New Relic", "Loggly"],
  "CI/CD & VCS": ["GoCD", "Git", "Bitbucket"],
  "Tools": ["JIRA", "Confluence", "Postman", "Agile/Scrum"],
};

const projects = [
  {
    name: "InfraLens",
    emoji: "🚀",
    tagline:
      "Construction intelligence platform that crawls MahaRERA, tracks project-level changes over time, delivers real-time notifications, and supports natural language queries.",
    description:
      "InfraLens is a construction intelligence platform that crawls MahaRERA, tracks project-level changes over time, delivers real-time notifications through email and webhooks, provides relevance-ranked search, and supports natural language queries powered by rule-based and LLM-assisted search.\n\nBuilt with Go, PostgreSQL, pg_trgm, cron scheduling, SMTP/webhook adapters, and Claude-powered query parsing.",
    badges: ["Go", "PostgreSQL", "pg_trgm", "Claude API"],
    stack: ["Go", "PostgreSQL", "pg_trgm", "Cron", "SMTP", "Webhooks", "Claude API"],
    github: "https://github.com/AadithS13/InfraLens",
    architecture: "/projects/infralens-architecture.svg",
    image: "/projects/infralens-cover.svg",
    imageAlt: "InfraLens pipeline architecture",
    highlights: [
      "Reverse engineered 7 undocumented MahaRERA APIs",
      "Built idempotent crawler with snapshot-based change detection",
      "Tracks field-level project history over time",
      "Notification engine with Email + Webhook adapters",
      "Full-text search using PostgreSQL pg_trgm",
      "Natural language search using rule-based and Claude-powered parsing",
      "Layered architecture (Handler → Core → Repo)",
      "Scheduled crawling with audit history and analytics APIs",
    ],
    evolution: [
      { version: "V1", label: "Data Ingestion" },
      { version: "V2", label: "Change Detection" },
      { version: "V3", label: "Search APIs" },
      { version: "V4", label: "Scheduling & Analytics" },
      { version: "V5", label: "Notification Platform" },
      { version: "V6", label: "Search & Discovery" },
      { version: "V7", label: "AI-Powered Search" },
    ],
  },
  {
    name: "FlowOrchestrator",
    emoji: "⚙️",
    tagline:
      "Kafka-powered workflow engine with retries, DLQ processing, idempotency, and production-grade observability.",
    description:
      "Distributed workflow orchestration platform built with Go and Kafka, featuring retries, DLQ handling, idempotent processing, observability, and fault-tolerant order processing.",
    badges: ["Go", "Kafka", "Prometheus", "Grafana"],
    stack: ["Go", "Kafka", "PostgreSQL", "Prometheus", "Grafana", "Docker"],
    github: "https://github.com/AadithS13/FlowOrchestrator",
    architecture: "/projects/floworchestrator-grafana.png",
    image: "/projects/floworchestrator-cover.svg",
    imageAlt: "FlowOrchestrator Grafana dashboard",
    highlights: [
      "Kafka-based async state machine with RETRYING_PAYMENT and DLQ states",
      "Idempotency keys scoped per attempt to allow genuine retries",
      "Prometheus metrics + Grafana dashboard included out of the box",
      "Load-tested end-to-end with automated scripts",
    ],
  },
];

const oss = [
  {
    title: "Redis Metrics Investigation",
    repo: "https://github.com/gofr-dev/gofr/issues/3455",
    repoLabel: "gofr-dev/gofr #3455",
    description:
      "Contributed analysis and proposed solutions for Redis health-check metrics pollution, evaluating trade-offs across instrumentation and observability strategies.",
    tags: ["Redis", "Observability", "Go"],
  },
  {
    title: "GoFr",
    repo: "https://github.com/gofr-dev/gofr",
    repoLabel: "gofr-dev/gofr",
    description:
      "Active contributor to GoFr — an opinionated Go framework for building microservices.",
    tags: ["Go", "Microservices", "Open Source"],
  },
];

const notes = [
  {
    title: "How I Reverse Engineered MahaRERA's Internal APIs",
    slug: "/notes/maharea-api",
    description:
      "A walkthrough of how I reverse engineered MahaRERA's undocumented internal APIs to build InfraLens — covering recon, crawler design, snapshot diffing, and change detection.",
    tags: ["Go", "Data Engineering", "Reverse Engineering", "InfraLens"],
    status: "published" as "draft" | "published",
  },
  {
    title: "Designing Snapshot-Based Change Detection Systems",
    slug: "/notes/snapshot-change-detection",
    description:
      "How to detect what changed in an external data source you don't control — checksums, field-level diffing, snapshot storage, and the design tradeoffs at scale.",
    tags: ["Go", "PostgreSQL", "System Design", "Data Engineering"],
    status: "published" as "draft" | "published",
  },
];

const awards = [
  {
    title: "Moonshot Award",
    event: "IM Hackathon 2023",
    org: "Infra.Market",
    description: "Won Moonshot Award at IM Hackathon 2023.",
  },
];

const currentlyBuilding = [
  "InfraLens — Builder Risk Intelligence & AI Search",
  "Agentic AI systems using Go, RAG, and tool calling",
  "OSS contributions to GoFr and the Redis ecosystem",
  "Learning Database Internals and Distributed Systems",
];

const interests = [
  "Distributed Systems",
  "Data Engineering",
  "Backend Infrastructure",
  "Event-Driven Architecture",
  "Developer Tooling",
  "Open Source",
  "Database Internals",
];

/* ─── Section heading ────────────────────────────────────────── */
function SectionHeading({ title }: { title: string }) {
  return (
    <Reveal className="mb-8">
      <h2 className="text-3xl font-semibold text-text">{title}</h2>
      <div className="heading-bar w-10 h-0.5 bg-green mt-2" />
    </Reveal>
  );
}

/* ─── Page ───────────────────────────────────────────────────── */
export default function Home() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      {/* md:ml-64 matches the new w-64 sidebar */}
      <main className="md:ml-64 flex-1 px-8 md:px-14 lg:px-20 py-14 md:py-16 pt-20 md:pt-16">

        {/* ── About ─────────────────────────────────────────── */}
        <section id="about" className="mb-20 scroll-mt-8">
          <SectionHeading title="About" />

          {/* Hero tagline */}
          <Reveal>
            <p className="text-xl font-medium leading-snug mb-5">
              <span className="gradient-text">
                Backend Engineer building distributed systems, data platforms,
                and AI-powered search systems using Go.
              </span>
              <span className="cursor-blink font-mono">▍</span>
            </p>
          </Reveal>

          <Reveal delay={120}>
            <p className="text-base text-subtle leading-relaxed">
              I&apos;m <span className="text-text font-medium">Aadith S</span>, a
              Bengaluru-based backend software engineer with ~3 years of experience
              designing and managing event-driven microservices. I&apos;ve authored
              technical design documents and led the delivery of critical systems
              — KYC deduplication, site deduplication, and deal mining flows.
              Proficient in Go, Kafka, gRPC, and PostgreSQL, with a strong emphasis
              on data integrity and system reliability.
            </p>
          </Reveal>
        </section>

        {/* ── Currently Building ────────────────────────────── */}
        <section id="building" className="mb-20 scroll-mt-8">
          <SectionHeading title="Currently Building" />
          <ul className="space-y-3">
            {currentlyBuilding.map((item, i) => (
              <Reveal key={i} delay={i * 80}>
                <li className="flex items-start gap-3 text-base text-subtle leading-relaxed">
                  <span className="text-green mt-1 flex-shrink-0">•</span>
                  {item}
                </li>
              </Reveal>
            ))}
          </ul>
        </section>

        {/* ── Projects ──────────────────────────────────────── */}
        <section id="projects" className="mb-20 scroll-mt-8">
          <SectionHeading title="Projects" />
          <div className="space-y-6">
            {projects.map((project, pi) => (
              <Reveal key={project.name} delay={pi * 100}>
              <GlowCard className="group border border-border rounded-lg overflow-hidden bg-surface transition-colors">
                {/* Screenshot */}
                <div className="relative w-full h-52 overflow-hidden bg-bg border-b border-border">
                  <Image
                    src={project.image}
                    alt={project.imageAlt}
                    fill
                    className="object-cover object-top opacity-80 group-hover:opacity-100 group-hover:scale-[1.025] transition-all duration-700 ease-out"
                    unoptimized
                  />
                </div>

                <div className="p-6">
                  {/* Title row */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-text flex items-center gap-2">
                        <span>{project.emoji}</span> {project.name}
                      </h3>
                      <p className="text-base text-subtle mt-0.5 leading-snug">
                        {project.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2 mb-4">
                    {project.description.split("\n\n").map((para, i) => (
                      <p key={i} className="text-sm text-muted leading-relaxed">
                        {para}
                      </p>
                    ))}
                  </div>

                  {/* Highlights */}
                  <p className="text-xs font-mono text-muted uppercase tracking-widest mb-2">Highlights</p>
                  <ul className="space-y-1.5 mb-5">
                    {project.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2 text-sm text-subtle">
                        <span className="text-green mt-0.5 flex-shrink-0">›</span>
                        {h}
                      </li>
                    ))}
                  </ul>

                  {/* Evolution timeline */}
                  {"evolution" in project && project.evolution && (
                    <div className="mb-5 pt-4 border-t border-border">
                      <p className="text-xs font-mono text-muted uppercase tracking-widest mb-3">
                        InfraLens Evolution
                      </p>
                      <div className="flex flex-wrap items-center gap-x-1 gap-y-2">
                        {project.evolution.map((step, idx) => (
                          <div key={step.version} className="flex items-center gap-1">
                            <span
                              className={`text-xs font-mono px-2 py-0.5 rounded ${
                                idx === project.evolution!.length - 1
                                  ? "bg-green/10 text-green border border-green/30"
                                  : "bg-border text-subtle border border-border"
                              }`}
                            >
                              <span className="font-semibold">{step.version}</span>
                              <span className="text-muted mx-1">·</span>
                              {step.label}
                            </span>
                            {idx < project.evolution!.length - 1 && (
                              <span className="text-muted text-xs">→</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Badges row */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {project.badges.map((b) => (
                      <span
                        key={b}
                        className="chip text-xs font-mono text-subtle border border-border px-2.5 py-1 rounded-full"
                      >
                        {b}
                      </span>
                    ))}
                  </div>

                  {/* Buttons row */}
                  <div className="flex items-center gap-3">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm text-subtle border border-border px-3.5 py-1.5 rounded hover:border-muted hover:text-text transition-colors"
                    >
                      <Github size={14} />
                      GitHub
                    </a>
                    <a
                      href={project.architecture}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm text-subtle border border-border px-3.5 py-1.5 rounded hover:border-muted hover:text-text transition-colors"
                    >
                      Architecture
                      <ArrowUpRight size={13} />
                    </a>
                  </div>
                </div>
              </GlowCard>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── Experience ────────────────────────────────────── */}
        <section id="experience" className="mb-20 scroll-mt-8">
          <SectionHeading title="Experience" />
          <div className="space-y-10">
            {experience.map((job, i) => (
              <Reveal key={i} delay={i * 90}>
              <div>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-text">{job.role}</h3>
                    <p className="text-base text-subtle">{job.company}</p>
                  </div>
                  <div className="sm:text-right flex-shrink-0">
                    <p className="text-sm font-mono text-muted">{job.period}</p>
                    <p className="text-sm text-muted">{job.location}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {job.items.map((item, j) => (
                    <div key={j}>
                      <p className="text-base text-text font-medium">{item.heading}:</p>
                      <p className="text-base text-subtle leading-relaxed mt-0.5">{item.body}</p>
                    </div>
                  ))}
                </div>
                {i < experience.length - 1 && (
                  <div className="mt-8 border-t border-border" />
                )}
              </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── Awards & Recognition ──────────────────────────── */}
        <section id="awards" className="mb-20 scroll-mt-8">
          <SectionHeading title="Awards & Recognition" />
          <div className="space-y-3">
            {awards.map((award) => (
              <Reveal key={award.title}>
                <GlowCard className="flex items-start gap-4 border border-border rounded-lg p-5 bg-surface">
                  <span className="text-green text-lg mt-0.5 flex-shrink-0">🏆</span>
                  <div>
                    <p className="text-base font-semibold text-text">{award.title}</p>
                    <p className="text-sm text-subtle mt-0.5">{award.description}</p>
                    <p className="text-xs font-mono text-muted mt-1">{award.event} · {award.org}</p>
                  </div>
                </GlowCard>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── Open Source ───────────────────────────────────── */}
        <section id="oss" className="mb-20 scroll-mt-8">
          <SectionHeading title="Open Source" />
          <div className="space-y-4">
            {oss.map((item, i) => (
              <Reveal key={item.title} delay={i * 80}>
              <GlowCard
                className="border border-border rounded-lg p-5 bg-surface transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="text-base font-semibold text-text">{item.title}</h3>
                  <a
                    href={item.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm font-mono text-muted hover:text-text transition-colors flex-shrink-0"
                  >
                    {item.repoLabel} <ArrowUpRight size={12} />
                  </a>
                </div>
                <p className="text-base text-subtle leading-relaxed mb-3">
                  {item.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {item.tags.map((t) => (
                    <span
                      key={t}
                      className="chip text-xs font-mono text-muted border border-border px-2.5 py-1 rounded-full"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </GlowCard>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── Engineering Notes ─────────────────────────────── */}
        <section id="notes" className="mb-20 scroll-mt-8">
          <SectionHeading title="Engineering Notes" />
          <div className="space-y-4">
            {notes.map((note, i) => (
              <Reveal key={note.slug} delay={i * 80}>
              <GlowCard className="rounded-lg">
              <Link
                href={note.slug}
                className="group flex flex-col border border-border rounded-lg p-5 bg-surface transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <BookOpen size={15} className="text-muted flex-shrink-0 mt-0.5" />
                    <h3 className="text-base font-semibold text-text group-hover:text-white transition-colors">
                      {note.title}
                    </h3>
                  </div>
                  {note.status === "draft" && (
                    <span className="text-xs font-mono text-muted border border-border px-2 py-0.5 rounded flex-shrink-0">
                      draft
                    </span>
                  )}
                </div>
                <p className="text-base text-subtle leading-relaxed mb-4 pl-6">
                  {note.description}
                </p>
                <div className="flex flex-wrap gap-1.5 pl-6">
                  {note.tags.map((t) => (
                    <span
                      key={t}
                      className="chip text-xs font-mono text-muted border border-border px-2.5 py-1 rounded-full"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </Link>
              </GlowCard>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── Skills ────────────────────────────────────────── */}
        <section id="skills" className="mb-20 scroll-mt-8">
          <SectionHeading title="Skills" />
          <div className="space-y-5">
            {Object.entries(skills).map(([category, items], i) => (
              <Reveal key={category} delay={i * 60}>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-8">
                  <p className="text-sm font-mono text-muted uppercase tracking-wider w-full sm:w-48 flex-shrink-0 pt-0.5">
                    {category}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {items.map((item) => (
                      <span
                        key={item}
                        className="chip text-sm font-mono text-subtle border border-border px-3 py-1 rounded"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── Interests ─────────────────────────────────────── */}
        <section id="interests" className="mb-20 scroll-mt-8">
          <SectionHeading title="Interests" />
          <div className="flex flex-wrap gap-3">
            {interests.map((interest, i) => (
              <Reveal key={interest} delay={i * 50}>
                <span className="chip inline-block text-sm text-subtle border border-border px-4 py-2 rounded-full">
                  {interest}
                </span>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── Contact ───────────────────────────────────────── */}
        <section id="contact" className="mb-16 scroll-mt-8">
          <SectionHeading title="Contact" />
          <Reveal>
            <p className="text-base text-subtle mb-8 leading-relaxed">
              Open to backend engineering roles and interesting technical
              conversations. Usually respond same day.
            </p>
          </Reveal>
          <Reveal delay={100} className="space-y-4">
            <div className="flex items-center gap-3">
              <MapPin size={16} className="text-muted flex-shrink-0" />
              <span className="text-base text-subtle">Bengaluru, India</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={16} className="text-muted flex-shrink-0" />
              <a
                href="mailto:aadithsuresh10@gmail.com"
                className="text-base text-subtle hover:text-text transition-colors"
              >
                aadithsuresh10@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Github size={16} className="text-muted flex-shrink-0" />
              <a
                href="https://github.com/AadithS13"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base text-subtle hover:text-text transition-colors"
              >
                github.com/AadithS13
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Linkedin size={16} className="text-muted flex-shrink-0" />
              <a
                href="https://www.linkedin.com/in/aadith-suresh/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base text-subtle hover:text-text transition-colors"
              >
                linkedin.com/in/aadith-suresh
              </a>
            </div>
          </Reveal>
        </section>

      </main>
    </div>
  );
}
