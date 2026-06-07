import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Designing Snapshot-Based Change Detection Systems — Aadith S",
  description:
    "How to detect what changed in an external data source you don't control — using checksums, field-level diffing, and snapshot storage in Go and PostgreSQL.",
};

/* ─── Prose helpers ──────────────────────────────────────────── */
function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-2xl font-semibold text-text mt-16 mb-5">{children}</h2>;
}
function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="text-lg font-semibold text-text mt-10 mb-3">{children}</h3>;
}
function P({ children }: { children: React.ReactNode }) {
  return <p className="text-base text-subtle leading-relaxed mb-5">{children}</p>;
}
function Li({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 text-base text-subtle leading-relaxed">
      <span className="text-green mt-1 flex-shrink-0">•</span>
      <span>{children}</span>
    </li>
  );
}
function Ul({ children }: { children: React.ReactNode }) {
  return <ul className="space-y-2 mb-5 ml-1">{children}</ul>;
}
function Pre({ children }: { children: React.ReactNode }) {
  return (
    <pre className="font-mono text-sm text-subtle bg-surface border border-border rounded-lg px-6 py-5 overflow-x-auto my-6 leading-relaxed">
      {children}
    </pre>
  );
}
function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="font-mono text-sm text-green bg-surface border border-border px-1.5 py-0.5 rounded">
      {children}
    </code>
  );
}
function Strong({ children }: { children: React.ReactNode }) {
  return <strong className="text-text font-semibold">{children}</strong>;
}
function Divider() {
  return <hr className="border-border my-14" />;
}
function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-l-2 border-green pl-5 my-6">
      <p className="text-base text-subtle leading-relaxed italic">{children}</p>
    </div>
  );
}
function ArticleImage({
  src, alt, caption, width = 1200, height = 700,
}: {
  src: string; alt: string; caption?: string; width?: number; height?: number;
}) {
  return (
    <figure className="my-10">
      <div className="border border-border rounded-lg overflow-hidden bg-surface">
        <Image src={src} alt={alt} width={width} height={height} className="w-full h-auto" unoptimized />
      </div>
      {caption && (
        <figcaption className="text-xs text-muted font-mono mt-3 text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/* ─── Page ───────────────────────────────────────────────────── */
export default function SnapshotChangeDetection() {
  return (
    <div className="min-h-screen bg-bg text-text">
      <div className="max-w-4xl mx-auto px-8 md:px-14 py-16">

        {/* Back */}
        <Link href="/#notes" className="inline-flex items-center gap-2 text-sm text-muted hover:text-text transition-colors mb-14">
          <ArrowLeft size={14} />
          Engineering Notes
        </Link>

        {/* Header */}
        <div className="mb-14">
          <p className="text-xs font-mono text-muted uppercase tracking-widest mb-5">
            Engineering Notes
          </p>
          <h1 className="text-4xl font-semibold text-text leading-tight mb-5">
            Designing Snapshot-Based Change Detection Systems
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted mb-8">
            <span className="font-mono">Aadith S</span>
            <span>·</span>
            <span>Jun 2026</span>
            <span>·</span>
            <span>12 min read</span>
            <span>·</span>
            <span>InfraLens</span>
          </div>
          <div className="w-10 h-0.5 bg-green" />
        </div>

        {/* ── The problem ─────────────────────────────────── */}
        <H2>The problem worth solving</H2>
        <P>
          You have an external data source you don&apos;t control. A government
          registry, a third-party API, a supplier&apos;s product catalog. You&apos;re
          crawling it on a schedule. Every run you pull down the current state
          of the world.
        </P>
        <P>
          The naive version of this system stores what you fetched and moves on.
          But &quot;what changed since last time?&quot; is almost always the more
          valuable question. Which projects moved from Under Approval to Ongoing?
          Which supplier changed a price? Which product went out of stock? These
          signals are what turn a crawler into an intelligence feed.
        </P>
        <P>
          The challenge is that external data sources give you no help here.
          They don&apos;t emit events. They don&apos;t version their responses. They
          don&apos;t tell you what changed — they just tell you what <em>is</em>. The
          burden of detecting change falls entirely on you.
        </P>
        <P>
          Snapshot-based change detection is the pattern I reached for when
          building InfraLens, a crawler over MahaRERA&apos;s real estate registry.
          This article is about how the system is designed, what the tradeoffs
          are, and where the edges are.
        </P>

        <Divider />

        {/* ── Why obvious approaches don't work ──────────── */}
        <H2>Why the obvious approaches don&apos;t work</H2>
        <P>Before settling on snapshots, consider what you might try first.</P>

        <H3>Full replace on every crawl</H3>
        <P>
          The simplest thing: every crawl, truncate the table and re-insert
          everything. You always have the current state. But you lose history
          completely. You can&apos;t answer &quot;what did this look like last week?&quot; and
          you can&apos;t answer &quot;when did this field change?&quot; You&apos;ve turned your
          database into a cache, not a record.
        </P>

        <H3>Timestamp-based filtering</H3>
        <P>
          If the API returns an <Code>updated_at</Code> field, you can filter
          to only records modified since your last crawl. This sounds appealing
          but is fragile in practice: many APIs don&apos;t expose update timestamps,
          or the timestamps are unreliable, or &quot;updated&quot; means something
          different than you expect. It also requires you to trust the
          source&apos;s clock. MahaRERA&apos;s API returns no timestamps on field
          modifications — just the current field values.
        </P>

        <H3>Dirty-flag polling</H3>
        <P>
          Some architectures add a boolean <Code>is_dirty</Code> column that
          gets set by the source system when something changes. This requires
          write access to the source schema, which you won&apos;t have for any
          external system.
        </P>

        <H3>Event streaming</H3>
        <P>
          If the source emits change events (Kafka, CDC, webhooks), you consume
          them instead of polling. This is architecturally ideal but completely
          unavailable for external systems that don&apos;t offer it. Government
          portals don&apos;t have Kafka topics.
        </P>

        <Callout>
          When none of these work, you&apos;re left with the fundamental constraint:
          the only information you have is a sequence of full snapshots over
          time. Your job is to extract the signal from the diff between them.
        </Callout>

        <Divider />

        {/* ── The snapshot model ──────────────────────────── */}
        <H2>The snapshot model</H2>
        <P>
          A snapshot is a point-in-time record of an entity&apos;s state. At its
          simplest, it&apos;s the raw response from the API plus a timestamp and an
          identifier.
        </P>
        <P>
          The key insight is that snapshots and your normalized entity rows are{" "}
          <Strong>separate concerns</Strong>. Your <Code>projects</Code> table
          holds the current state, used for queries. Your{" "}
          <Code>project_snapshots</Code> table holds the history, used for
          diffing. They&apos;re updated independently, serve different purposes, and
          have different access patterns.
        </P>
        <Pre>{`CREATE TABLE project_snapshots (
    id          SERIAL PRIMARY KEY,
    project_id  INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    fetched_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    checksum    TEXT NOT NULL,
    raw_json    JSONB NOT NULL
);
CREATE INDEX idx_snapshots_project_id ON project_snapshots(project_id);`}</Pre>
        <P>And the change log that snapshots power:</P>
        <Pre>{`CREATE TABLE project_changes (
    id          SERIAL PRIMARY KEY,
    project_id  INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    field_name  TEXT NOT NULL,
    old_value   TEXT,
    new_value   TEXT,
    detected_at TIMESTAMPTZ NOT NULL
);`}</Pre>
        <P>
          The <Code>project_changes</Code> table is not a snapshot — it&apos;s
          derived output. Snapshots are the source of truth; changes are what
          you extract by diffing consecutive snapshots. If you ever need to add
          a new tracked field, you can re-run the diff over your existing
          snapshots without re-crawling anything.
        </P>

        <Divider />

        {/* ── Data Model ──────────────────────────────────── */}
        <H2>Data Model</H2>
        <P>The crawler stores two different kinds of information:</P>
        <Ul>
          <Li>
            The <Strong>current state</Strong> of a project, optimized for
            search and analytics.
          </Li>
          <Li>
            <Strong>Historical snapshots</Strong>, optimized for change
            detection and auditing.
          </Li>
        </Ul>
        <P>
          Keeping these concerns separate simplifies both query patterns and
          system evolution.
        </P>
        <P>
          The normalized tables (<Code>projects</Code>,{" "}
          <Code>promoters</Code>, <Code>addresses</Code>, and{" "}
          <Code>contacts</Code>) represent the latest known state of the
          registry and power search APIs.
        </P>
        <P>
          The historical tables (<Code>project_snapshots</Code> and{" "}
          <Code>project_changes</Code>) preserve crawl history and enable
          field-level change tracking.
        </P>
        <P>This separation allows InfraLens to answer both operational questions:</P>
        <Ul>
          <Li>Show all ongoing projects in Pune.</Li>
          <Li>Find projects registered by a specific promoter.</Li>
        </Ul>
        <P>and historical questions:</P>
        <Ul>
          <Li>Which projects changed status last month?</Li>
          <Li>Which builders repeatedly extended completion dates?</Li>
          <Li>What did a project look like six months ago?</Li>
        </Ul>

        <ArticleImage
          src="/projects/infralens-er-diagram.png"
          alt="InfraLens ER diagram — PROMOTERS owns PROJECTS, which has CONTACTS, stores PROJECT_SNAPSHOTS, generates PROJECT_CHANGES, and links to ADDRESSES"
          caption="Figure 1. Simplified InfraLens schema showing current-state entities, historical snapshots, and change tracking."
          width={1060}
          height={1100}
        />

        <P>
          The checksum fast-path exists because most entities do not change
          between crawls. Without a fast-path, the system would perform
          expensive field-level comparisons for every project on every crawl.
          Instead, InfraLens first compares checksums and only performs deeper
          analysis when a difference is detected.
        </P>

        <ArticleImage
          src="/projects/snapshot-change-detection-flow.png"
          alt="Change detection flow: Fetch Project → Serialize JSON → Generate MD5 → Load Latest Snapshot → Checksum Match? → NEW / SAME / DIFF → field-level diff → Write project_changes → Store New Snapshot"
          caption="Figure 2. Snapshot-based change detection workflow used by InfraLens."
          width={560}
          height={1000}
        />

        <Divider />

        {/* ── Checksum fast path ──────────────────────────── */}
        <H2>The checksum fast path</H2>
        <P>
          Most entities on any given crawl haven&apos;t changed. Without a fast
          path, you&apos;re doing expensive field-level comparisons on tens of
          thousands of records that haven&apos;t moved.
        </P>
        <P>
          The checksum solves this. Before storing or comparing anything, you
          serialize the API response to a canonical form and hash it:
        </P>
        <Pre>{`generalJSON, _ := json.Marshal(general)
checksum := fmt.Sprintf("%x", md5.Sum(generalJSON))`}</Pre>
        <P>Then fetch the latest snapshot and compare checksums:</P>
        <Pre>{`latestSnap, _ := store.GetLatestSnapshot(ctx, projectDBID)
if latestSnap == nil {
    // First crawl — no diff, just snapshot
} else if latestSnap.Checksum == checksum {
    // Nothing changed — skip
} else {
    // Something changed — do the field-level diff
}`}</Pre>
        <P>The decision tree for every entity:</P>
        <Pre>{`Fetch from source
      │
      ▼
Serialize → MD5
      │
      ▼
Fetch latest snapshot checksum
      │
      ├── No snapshot    → [NEW]  insert everything
      ├── Same checksum  → [SAME] skip, cost is one index lookup
      └── Different      → [DIFF] decode old snapshot, compare fields`}</Pre>

        <H3>Why MD5?</H3>
        <P>
          You might reach for SHA-256 out of habit. MD5 is faster and the
          output is shorter, which matters when you&apos;re computing it for every
          entity on every crawl. The collision concern with MD5 applies to
          adversarial contexts. In change detection over your own serialized
          structs, there&apos;s no adversary. Use what&apos;s fast.
        </P>

        <H3>Canonicalization matters</H3>
        <P>
          The checksum only works if the serialized form is deterministic. For
          JSON, Go&apos;s <Code>encoding/json</Code> marshals struct fields in
          declaration order, which is stable. In InfraLens, the API response is
          always deserialized into typed structs first and then re-serialized —
          which produces a canonical form regardless of wire order.
        </P>

        <H3>What you&apos;re hashing</H3>
        <P>
          Only hash the data you care about. Scope the checksum to the fields
          you intend to track. If you hash too much, cosmetic changes in
          irrelevant fields will trigger false-positive diffs. If you hash too
          little, you&apos;ll miss real changes.
        </P>

        <Divider />

        {/* ── Field-level diffing ─────────────────────────── */}
        <H2>Field-level diffing</H2>
        <P>
          When the checksum says something changed, the field-level diff tells
          you what. Define a table of tracked fields, each with a function that
          extracts its value from the entity struct:
        </P>
        <Pre>{`var trackedFields = []struct {
    name string
    get  func(*model.ProjectGeneral) string
}{
    {"project_status",           func(p *model.ProjectGeneral) string { return p.ProjectStatusName }},
    {"project_current_status",   func(p *model.ProjectGeneral) string { return p.ProjectCurrentStatus }},
    {"proposed_completion_date", func(p *model.ProjectGeneral) string { return p.ProjectProposeComplitionDate }},
    {"total_units",              func(p *model.ProjectGeneral) string { return fmt.Sprintf("%d", p.TotalNumberOfUnits) }},
    {"total_sold_units",         func(p *model.ProjectGeneral) string { return fmt.Sprintf("%d", p.TotalNumberOfSoldUnits) }},
    {"rera_registration_no",     func(p *model.ProjectGeneral) string { return p.ProjectRegistrationNo }},
}

func diffGeneralFields(projectID int, prev, curr *model.ProjectGeneral, at time.Time) []model.ProjectChange {
    var changes []model.ProjectChange
    for _, f := range trackedFields {
        if old, new_ := f.get(prev), f.get(curr); old != new_ {
            changes = append(changes, model.ProjectChange{
                ProjectID:  projectID,
                FieldName:  f.name,
                OldValue:   old,
                NewValue:   new_,
                DetectedAt: at,
            })
        }
    }
    return changes
}`}</Pre>
        <P>
          Everything is normalized to <Code>string</Code> for comparison and
          storage. This keeps the change log homogeneous — the{" "}
          <Code>project_changes</Code> table doesn&apos;t need typed value columns
          for every possible field. You can query it with simple SQL:
        </P>
        <Pre>{`-- Projects whose completion date changed in the last 30 days
SELECT p.project_name, pc.old_value, pc.new_value, pc.detected_at
FROM project_changes pc
JOIN projects p ON p.id = pc.project_id
WHERE pc.field_name = 'proposed_completion_date'
  AND pc.detected_at > NOW() - INTERVAL '30 days'
ORDER BY pc.detected_at DESC;

-- Which builders keep extending completion dates?
SELECT pr.name, COUNT(*) AS extensions
FROM project_changes pc
JOIN projects p   ON p.id  = pc.project_id
JOIN promoters pr ON pr.id = p.promoter_id
WHERE pc.field_name = 'proposed_completion_date'
  AND pc.new_value > pc.old_value
GROUP BY pr.name
ORDER BY extensions DESC;`}</Pre>

        <H3>Adding tracked fields later</H3>
        <P>
          Add an entry to <Code>trackedFields</Code> and from the next crawl
          onward that field is tracked. Old snapshots already have the data in{" "}
          <Code>raw_json</Code> — you can re-diff them offline for historical
          backfill without re-crawling.
        </P>

        <H3>Removing tracked fields</H3>
        <P>
          Remove the entry from <Code>trackedFields</Code>. Old rows in{" "}
          <Code>project_changes</Code> remain as the historical record. Future
          crawls simply won&apos;t add new rows for that field.
        </P>

        <Divider />

        {/* ── Always write the snapshot ───────────────────── */}
        <H2>Writing the snapshot: always, regardless of diff result</H2>
        <P>
          A critical design decision: write a snapshot on every crawl, whether
          or not anything changed.
        </P>
        <P>
          It might seem wasteful to store a snapshot you know is identical to
          the last one. But if you only write snapshots when something changes,
          you lose the ability to answer &quot;was this project successfully crawled
          on June 1st?&quot; The absence of a snapshot for a given date becomes
          ambiguous — did nothing change, or did the crawl fail?
        </P>
        <P>
          Writing a snapshot every time also decouples the snapshot log from
          the change log. The change log records <em>what</em> changed; the
          snapshot log records <em>that</em> the crawler ran. They answer
          different questions.
        </P>
        <Callout>
          If storage is a concern, write snapshots only on [NEW] and [DIFF]
          events and log [SAME] to a lightweight audit table. But start by
          writing all of them. Premature optimization here costs you
          observability.
        </Callout>

        <Divider />

        {/* ── Reconstructing history ──────────────────────── */}
        <H2>Reconstructing history from raw snapshots</H2>
        <P>
          Storing raw JSON in snapshots pays dividends you don&apos;t fully
          appreciate when you first design the system.
        </P>
        <Ul>
          <Li>
            <Strong>New tracked field, six months later.</Strong> With raw
            snapshots, you already have all the data you need. Without them,
            you&apos;d have to re-crawl six months of history.
          </Li>
          <Li>
            <Strong>Bug in diff logic.</Strong> With raw snapshots, you can
            re-derive correct diffs and delete the incorrect ones. Without
            them, bad data is permanent.
          </Li>
          <Li>
            <Strong>Source API schema change.</Strong> The raw snapshot gives
            you an auditable record of exactly what the API returned on each
            date, separate from how your code interpreted it.
          </Li>
        </Ul>
        <P>
          The cost is storage. <Code>JSONB</Code> in PostgreSQL compresses
          well. For InfraLens at 50,000 projects, a daily crawl producing ~2KB
          per snapshot lands at roughly 36GB per year — well within what a
          single Postgres instance handles. A time-based retention policy on{" "}
          <Code>project_snapshots</Code> solves growth without touching the
          change log.
        </P>

        <Divider />

        {/* ── Concurrency ─────────────────────────────────── */}
        <H2>Concurrency and the snapshot write order</H2>
        <P>
          Within each entity, there&apos;s a critical ordering constraint: the
          field-level diff must read the latest snapshot <em>before</em>{" "}
          writing the new one. If two crawls of the same entity ran
          concurrently, both reads might see the same &quot;latest&quot; snapshot and
          you&apos;d get duplicate change records.
        </P>
        <P>
          In InfraLens this is handled by making project IDs unique inputs to
          the job channel — each project ID appears exactly once per crawl run.
          For distributed crawlers where the same entity could be processed by
          multiple machines, serialize the snapshot write behind a
          database-level advisory lock:
        </P>
        <Pre>{`-- Serialize snapshot operations per project
SELECT pg_advisory_xact_lock(project_id);
-- read latest snapshot, compute diff, write new snapshot
COMMIT; -- releases lock`}</Pre>

        <Divider />

        {/* ── Schema design ───────────────────────────────── */}
        <H2>The schema design choices worth calling out</H2>

        <H3><Code>raw_json JSONB NOT NULL</Code> on snapshots</H3>
        <P>
          JSONB, not TEXT. Postgres JSONB is stored in a binary format that
          deduplicates keys and is indexable. If you ever want to query snapshot
          content directly — &quot;show me all snapshots where{" "}
          <Code>total_sold_units</Code> &gt; 100&quot; — JSONB makes that possible.
          TEXT doesn&apos;t.
        </P>

        <H3><Code>old_value TEXT, new_value TEXT</Code> on changes</H3>
        <P>
          All field values are stored as strings. Dates become ISO strings,
          integers become their string representation. This keeps the schema
          simple and queries uniform. The tradeoff is that numeric comparisons
          require casting in SQL — acceptable for the queries that matter most.
        </P>

        <H3>No FK from <Code>project_changes</Code> to <Code>project_snapshots</Code></H3>
        <P>
          Changes are derived from snapshots but not permanently linked to a
          specific snapshot pair. This simplifies re-derivation: if you re-run
          the diff logic, you delete old change records and reinsert new ones
          without any FK cascade concerns.
        </P>

        <H3>Separate <Code>detected_at</Code> vs <Code>fetched_at</Code></H3>
        <P>
          <Code>project_snapshots.fetched_at</Code> is when the crawler fetched
          the data. <Code>project_changes.detected_at</Code> is when the change
          was detected. They&apos;re the same value in practice but kept
          semantically distinct: <Code>fetched_at</Code> is a data provenance
          timestamp; <Code>detected_at</Code> is a business event timestamp.
        </P>

        <Divider />

        {/* ── What doesn't scale ──────────────────────────── */}
        <H2>What doesn&apos;t scale and what to do about it</H2>

        <H3>The checksum approach breaks under noisy data</H3>
        <P>
          If the source API returns fields that change on every call —
          timestamps, request IDs, session artifacts — you&apos;ll get a
          false-positive diff on every crawl. Fix: normalize the data before
          hashing, or only hash the subset of fields you care about. Deserializing
          into typed structs (which drops unknown fields) handles this
          automatically.
        </P>

        <H3>One snapshot per crawl per entity</H3>
        <P>
          At 50,000 entities crawled daily, you&apos;re writing 50,000 rows per day.
          After a year that&apos;s 18 million rows. Postgres handles this fine with
          the right indexes, but you&apos;ll want a retention policy before you hit
          hundreds of millions. Keep the change log indefinitely; prune raw
          snapshots to a rolling window.
        </P>

        <H3>Re-diffing is expensive at scale</H3>
        <P>
          Adding a new tracked field and backfilling historical changes from 18
          million snapshot rows is a batch job, not a one-liner. Design the
          backfill as an offline process with a cursor so it can be paused and
          resumed.
        </P>

        <Divider />

        {/* ── What I'd do differently ─────────────────────── */}
        <H2>What I&apos;d do differently</H2>

        <H3>Store a schema version on each snapshot</H3>
        <P>
          Right now, raw JSON is unversioned — you rely on Go struct tag
          definitions being stable. A <Code>schema_version</Code> column lets
          you dispatch to different deserializers for old and new formats when
          the source API changes.
        </P>

        <H3>Make the tracked field list a database table</H3>
        <P>
          Currently, adding a tracked field requires a code change and
          redeploy. A <Code>tracked_fields</Code> table lets you add fields via
          a database mutation. The diff logic queries the table at runtime.
          More operationally flexible, slightly more complex.
        </P>

        <H3>Track deletions explicitly</H3>
        <P>
          The current system detects changes to existing entities and new
          entities appearing for the first time. It doesn&apos;t have a clean model
          for an entity disappearing. A <Code>deleted_at</Code> timestamp on
          the entity row, set when a crawl returns 404 for a known entity,
          rounds out the event model.
        </P>

        <Divider />

        {/* ── The broader pattern ─────────────────────────── */}
        <H2>The broader pattern</H2>
        <P>
          Snapshot-based change detection shows up wherever you&apos;re consuming
          data from a source that doesn&apos;t emit events. GitHub&apos;s API for commit
          history. An e-commerce competitor&apos;s pricing page. A regulatory
          database. A supplier catalog.
        </P>
        <P>
          The pattern is always the same: capture the full state at fetch time,
          store it durably, compare it to the previous capture, and record what
          moved. The specifics differ — what you hash, how many fields you
          track, how long you keep snapshots — but the shape is invariant.
        </P>
        <P>
          The reason the pattern works is that it makes no assumptions about
          the source. It doesn&apos;t require an <Code>updated_at</Code> field. It
          doesn&apos;t require webhooks. It doesn&apos;t require cooperation from the data
          owner at all. You treat the source as a black box that returns a
          current state, and you reconstruct the history yourself.
        </P>
        <Callout>
          If you could subscribe to MahaRERA&apos;s change feed, someone would have
          already built Biltrax.
        </Callout>
        <P>
          InfraLens is on{" "}
          <a
            href="https://github.com/AadithS13/InfraLens"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text underline underline-offset-2 hover:text-green transition-colors"
          >
            GitHub
          </a>
          . The snapshot and change detection logic lives in{" "}
          <Code>internal/crawler/crawler.go</Code> and{" "}
          <Code>internal/store/postgres.go</Code>.
        </P>

        <Divider />

        {/* Further Reading */}
        <div className="border border-border rounded-lg p-6 bg-surface">
          <p className="text-xs font-mono text-muted uppercase tracking-widest mb-5">
            Further Reading
          </p>
          <ul className="space-y-3">
            {[
              { label: "How I Reverse Engineered MahaRERA's Internal APIs", href: "/notes/maharea-api" },
              { label: "InfraLens GitHub Repository", href: "https://github.com/AadithS13/InfraLens" },
              { label: "FlowOrchestrator", href: "https://github.com/AadithS13/FlowOrchestrator" },
              { label: "LinkedIn", href: "https://www.linkedin.com/in/aadith-suresh/" },
            ].map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  target={href.startsWith("/") ? undefined : "_blank"}
                  rel={href.startsWith("/") ? undefined : "noopener noreferrer"}
                  className="flex items-center gap-2 text-base text-subtle hover:text-text transition-colors"
                >
                  <span className="text-green">•</span>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-8 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Link href="/#notes" className="inline-flex items-center gap-2 text-sm text-muted hover:text-text transition-colors">
            <ArrowLeft size={14} />
            Engineering Notes
          </Link>
          <a
            href="https://github.com/AadithS13/InfraLens"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted hover:text-text transition-colors font-mono"
          >
            github.com/AadithS13/InfraLens ↗
          </a>
        </div>

      </div>
    </div>
  );
}
