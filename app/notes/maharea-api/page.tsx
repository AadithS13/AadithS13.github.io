import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "How I Reverse Engineered MahaRERA's Internal APIs — Aadith S",
  description:
    "How I reverse engineered MahaRERA's undocumented internal APIs to build InfraLens — covering recon, auth, concurrent crawling, and snapshot-based change detection.",
};

/* ─── Prose helpers ──────────────────────────────────────────── */
function H2({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="text-2xl font-semibold text-text mt-16 mb-5">
      {children}
    </h2>
  );
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
  return <ul className="space-y-2 mb-5">{children}</ul>;
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
  src,
  alt,
  caption,
  width = 1200,
  height = 700,
}: {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}) {
  return (
    <figure className="my-10">
      <div className="border border-border rounded-lg overflow-hidden bg-surface">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-auto"
          unoptimized
        />
      </div>
      {caption && (
        <figcaption className="text-xs text-muted font-mono mt-3 text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto my-6">
      <table className="w-full text-sm font-mono border-collapse">
        <thead>
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                className="text-left text-xs text-muted uppercase tracking-wider border-b border-border pb-3 pr-8"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-border/40">
              {row.map((cell, j) => (
                <td key={j} className="text-subtle py-3 pr-8 align-top leading-relaxed">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────── */
export default function MahaRERAArticle() {
  return (
    <div className="min-h-screen bg-bg text-text">
      <div className="max-w-4xl mx-auto px-8 md:px-14 py-16">

        {/* Back */}
        <Link
          href="/#notes"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-text transition-colors mb-14"
        >
          <ArrowLeft size={14} />
          Engineering Notes
        </Link>

        {/* Header */}
        <div className="mb-14">
          <p className="text-xs font-mono text-muted uppercase tracking-widest mb-5">
            Engineering Notes
          </p>
          <h1 className="text-4xl font-semibold text-text leading-tight mb-5">
            How I Reverse Engineered MahaRERA&apos;s Internal APIs
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted mb-8">
            <span className="font-mono">Aadith S</span>
            <span>·</span>
            <span>Jun 2026</span>
            <span>·</span>
            <span>8 min read</span>
            <span>·</span>
            <span>InfraLens</span>
          </div>
          <div className="w-10 h-0.5 bg-green" />
        </div>

        {/* Key Takeaways */}
        <div className="border border-border rounded-lg p-6 bg-surface mb-14">
          <p className="text-xs font-mono text-muted uppercase tracking-widest mb-4">
            Key Takeaways
          </p>
          <Ul>
            <Li>Reverse engineered 7 undocumented MahaRERA APIs</Li>
            <Li>Identified the authentication flow used by the public portal</Li>
            <Li>Built a concurrent Go crawler with token refresh and rate limiting</Li>
            <Li>Implemented snapshot-based change detection for historical tracking</Li>
            <Li>Exposed normalized project data through search and analytics APIs</Li>
          </Ul>
        </div>

        {/* ── Introduction ────────────────────────────────── */}
        <H2>Introduction</H2>
        <P>
          While building InfraLens, I needed a machine-readable source of
          real-estate project data from MahaRERA.
        </P>
        <P>
          The portal exposes no public API, but every page on the website is
          backed by internal API calls. If the browser can fetch the data, the
          backend endpoint exists somewhere.
        </P>
        <P>
          This article covers how I identified those APIs, understood the
          authentication flow, mapped the data model, and built a production
          crawler with change detection.
        </P>

        <ArticleImage
          src="/projects/infralens-arch-diagram.png"
          alt="InfraLens full architecture — MahaRERA API through Crawler, Worker Pool, Change Detection, PostgreSQL, and REST API"
          caption="InfraLens architecture — from public API crawling to change detection and REST API"
          width={760}
          height={980}
        />

        <Divider />

        {/* ── Recon ─────────────────────────────────────────── */}
        <H2>The Recon Phase</H2>
        <P>
          The first thing I noticed was that MahaRERA is implemented as a
          single-page application.
        </P>
        <P>
          Opening the browser&apos;s Network tab revealed that loading a project
          page triggered several POST requests behind the scenes.
        </P>
        <P>
          One request immediately stood out:
        </P>
        <Pre>{`/api/maha-rera-public-view-project-registration-service/
public/projectregistartion/
getProjectGeneralDetailsByProjectId`}</Pre>
        <P>
          The naming was surprisingly descriptive. Within minutes I had
          identified multiple endpoints responsible for serving project details,
          promoter information, addresses, professionals, and agents. The
          service names effectively documented the backend architecture.
        </P>

        {/* DevTools screenshot — save the network tab image from the chat as infralens-devtools.png */}
        <ArticleImage
          src="/projects/infralens-devtools.png"
          alt="Chrome DevTools Network tab showing MahaRERA API requests including getProjectGeneralDetailsByProjectId and the raw JSON response"
          caption="Chrome DevTools — 186 internal POST requests fired on a single project page load. getProjectGeneralDetailsByProjectId highlighted with raw responseObject visible."
          width={1110}
          height={940}
        />

        <Divider />

        {/* ── Auth ──────────────────────────────────────────── */}
        <H2>Finding the Authentication Flow</H2>
        <P>
          Every request carried an <Code>Authorization</Code> header:
        </P>
        <Pre>{`Authorization: Bearer <token>`}</Pre>
        <P>
          The next step was figuring out where the token originated. Searching
          through the JavaScript bundle revealed an authentication endpoint:
        </P>
        <Pre>{`/api/maha-rera-login-service/login/authenticatePublic`}</Pre>
        <P>
          The Angular application contained encrypted credentials for a
          public-view account. The credentials were not truly secret because the
          browser itself needed access to them. Sending the same payload to the
          authentication endpoint returned:
        </P>
        <Pre>{`{
  "responseObject": {
    "accessToken": "...",
    "refreshToken": "...",
    "expires_in": 6000
  }
}`}</Pre>
        <P>
          The token lifetime was roughly 100 minutes. InfraLens refreshes the
          token slightly before expiry to prevent mid-crawl failures.
        </P>

        <Divider />

        {/* ── API Surface ───────────────────────────────────── */}
        <H2>Mapping the API Surface</H2>
        <P>
          Each project page required several API calls. The primary call
          returned project information and a <Code>userProfileId</Code>. That
          identifier was then required by multiple promoter-related endpoints.
        </P>
        <P>The dependency graph looked like:</P>
        <Pre>{`Project Details
       |
       v
  userProfileId
       |
       +--> Promoter Details
       +--> Promoter Address
       +--> Associations`}</Pre>
        <P>
          The complete project view was assembled from seven backend services:
        </P>
        <Table
          headers={["Endpoint", "Request body", "Returns"]}
          rows={[
            ["getProjectGeneralDetailsByProjectId", "{ projectId }", "Name, RERA number, status, dates, userProfileId"],
            ["getProjectAndAssociatedPromoterDetails", "{ projectId }", "Promoter name (fallback)"],
            ["fetchPromoterGeneralDetails", "{ userProfileId, projectId }", "PAN, GSTIN, promoter type"],
            ["getProjectLandAddressDetails", "{ projectId }", "Plot and street-level address"],
            ["getPromoterAddressDetails", "{ userProfileId, projectId }", "Promoter's office address"],
            ["getProjectProfessionalByType", "{ projectId, professionalTypeName }", "Architects, structural engineers"],
            ["getAgentByProjectId", "{ projectId }", "Registered real estate agents"],
          ]}
        />

        <Divider />

        {/* ── Crawler ───────────────────────────────────────── */}
        <H2>Building the Crawler</H2>
        <P>The crawler is written in Go. The goals were:</P>
        <Ul>
          <Li>Handle token refresh automatically</Li>
          <Li>Support concurrent crawling</Li>
          <Li>Avoid duplicate data</Li>
          <Li>Enable future change tracking</Li>
        </Ul>
        <P>
          A worker-pool architecture processes projects concurrently:
        </P>
        <Pre>{`const workers = 5
const rateDelay = 300 * time.Millisecond`}</Pre>
        <P>Each worker:</P>
        <Ul>
          <Li>Fetches project details</Li>
          <Li>Extracts <Code>userProfileId</Code></Li>
          <Li>Launches secondary API calls in parallel</Li>
          <Li>Persists normalized records</Li>
          <Li>Stores a crawl snapshot</Li>
        </Ul>
        <P>
          This reduces total crawl latency to roughly the duration of the
          slowest downstream API call.
        </P>

        <Divider />

        {/* ── Data Modeling ─────────────────────────────────── */}
        <H2>Data Modeling</H2>
        <P>
          Raw API responses are difficult to query efficiently. InfraLens
          normalizes the data into dedicated tables:
        </P>
        <Ul>
          <Li><Code>promoters</Code></Li>
          <Li><Code>projects</Code></Li>
          <Li><Code>addresses</Code></Li>
          <Li><Code>contacts</Code></Li>
          <Li><Code>project_snapshots</Code></Li>
          <Li><Code>project_changes</Code></Li>
        </Ul>
        <P>
          Projects are uniquely identified using the MahaRERA project ID.
          Promoters are deduplicated using their user profile ID. This makes
          repeated crawls idempotent and prevents duplicate records.
        </P>

        <ArticleImage
          src="/projects/infralens-er-diagram.png"
          alt="InfraLens ER diagram — PROMOTERS owns PROJECTS, which has CONTACTS, stores PROJECT_SNAPSHOTS, generates PROJECT_CHANGES, and links to ADDRESSES"
          caption="Normalized schema used by InfraLens for projects, promoters, snapshots and change history."
          width={1060}
          height={1100}
        />

        <Divider />

        {/* ── Change Detection ──────────────────────────────── */}
        <H2>Snapshot-Based Change Detection</H2>
        <P>
          This is where the crawler becomes a data intelligence platform.
        </P>
        <P>
          Every crawl serializes the project response and computes an MD5
          checksum. The checksum is compared against the latest stored snapshot.
          Three outcomes are possible:
        </P>
        <Table
          headers={["Result", "Meaning"]}
          rows={[
            ["NEW", "First observation of this project"],
            ["SAME", "No changes detected — skip"],
            ["DIFF", "Project data has changed — diff fields"],
          ]}
        />

        <ArticleImage
          src="/projects/infralens-change-detection.png"
          alt="Change detection flow: Crawl Project → Generate MD5 → Checksum Changed? → SAME or Load Previous Snapshot → Field Comparison → Write project_changes → Store New Snapshot"
          caption="Change detection pipeline — MD5 checksum fast path, field-level diff on change"
          width={3374}
          height={416}
        />

        <P>
          When a change is detected, InfraLens compares tracked fields such as:
        </P>
        <Ul>
          <Li>Project status</Li>
          <Li>Current status</Li>
          <Li>Completion date</Li>
          <Li>Project name</Li>
          <Li>Unit counts</Li>
          <Li>Registration number</Li>
        </Ul>
        <P>Each field-level change generates its own record:</P>
        <Pre>{`field_name               old_value        new_value
---------------------------------------------------
project_status           Approval         Ongoing
completion_date          2024-12-31       2025-06-30`}</Pre>
        <P>This enables queries such as:</P>
        <Ul>
          <Li>Which projects changed status this month?</Li>
          <Li>Which builders delayed completion dates?</Li>
          <Li>Which projects increased inventory?</Li>
        </Ul>
        <Callout>
          These are exactly the types of insights commercial
          construction-intelligence platforms provide.
        </Callout>

        <Divider />

        {/* ── Lessons ───────────────────────────────────────── */}
        <H2>Lessons Learned</H2>

        <P>
          <Strong>Government APIs often already exist.</Strong> Many public
          portals do not expose official APIs, but their frontend applications
          consume internal APIs that are accessible through browser inspection.
        </P>
        <P>
          <Strong>Client-side secrets are not secrets.</Strong> If a browser
          can decrypt credentials, those credentials should be considered
          public.
        </P>
        <P>
          <Strong>POST-for-read is common.</Strong> Several endpoints used POST
          requests for simple reads. While unconventional, it does not prevent
          integration.
        </P>
        <P>
          <Strong>Typos become permanent.</Strong> Field names such as{" "}
          <Code>projectRegistartionNo</Code> and{" "}
          <Code>projectProposeComplitionDate</Code> exist in production systems
          and often cannot be changed without breaking clients.
        </P>
        <P>
          <Strong>Change detection creates value.</Strong> Collecting data is
          straightforward. Maintaining history and surfacing meaningful changes
          is where intelligence platforms differentiate themselves.
        </P>

        <Divider />

        {/* ── Conclusion ────────────────────────────────────── */}
        <H2>Conclusion</H2>
        <P>
          InfraLens started as a crawler but evolved into a construction
          intelligence platform. The crawler continuously collects project data,
          snapshots state over time, tracks field-level changes, and exposes the
          results through APIs.
        </P>
        <P>
          The interesting challenge was never obtaining the data. The
          interesting challenge was turning snapshots into a living historical
          record. That&apos;s where the real engineering begins.
        </P>

        {/* Further Reading */}
        <div className="mt-16 border border-border rounded-lg p-6 bg-surface">
          <p className="text-xs font-mono text-muted uppercase tracking-widest mb-5">
            Further Reading
          </p>
          <ul className="space-y-3">
            {[
              {
                label: "InfraLens GitHub Repository",
                href: "https://github.com/AadithS13/InfraLens",
              },
              {
                label: "FlowOrchestrator",
                href: "https://github.com/AadithS13/FlowOrchestrator",
              },
              {
                label: "LinkedIn",
                href: "https://www.linkedin.com/in/aadith-suresh/",
              },
            ].map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-base text-subtle hover:text-text transition-colors"
                >
                  <span className="text-green">•</span>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer nav */}
        <div className="mt-8 pt-8 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Link
            href="/#notes"
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-text transition-colors"
          >
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
