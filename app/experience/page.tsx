const experience = [
  {
    company: "Infra.Market",
    role: "Software Engineer 2",
    period: "Apr 2024 — Present",
    location: "Bangalore, India",
    current: true,
    bullets: [
      "TDD author & cross-team lead for Customer KYC Deduplication — Kafka-orchestrated multi-service flow covering GST/PAN-based duplicate prevention, nudging during creation, and merge-with-verified-parent flow → reduced duplicates by 35%, improved reporting accuracy by 25%.",
      "TDD author & lead for Site Deduplication — three-layer strategy: prevention via existing-site lookup, pincode-matched nudging to surface similar sites, and geocode-based bulk data cleanup → cut address duplicates by 30%.",
      "TDD author & lead for Deal Mining Flow — ingested RERA and external data sources, built automated pipeline to generate leads, identify new customers, infer project stage to predict product needs, and assign cross-sell deals to relevant BU sales officers → +15% lead generation, +5–10% deal conversion.",
    ],
  },
  {
    company: "Infra.Market",
    role: "Software Engineer",
    period: "Jul 2023 — Mar 2024",
    location: "Chennai, India",
    current: false,
    bullets: [
      "Built People Entity Framework with persona-based schema and role-access model → onboarded 1M+ active users.",
      "Core contributor to building the company's internal CRM from the ground up, integrated with Microsoft Dynamics ERP for financial data sync.",
      "Integrated Ozonetel CTI (calling platform) into the CRM, enabling in-app click-to-call, call logging, and sales activity tracking for the field sales team.",
    ],
  },
  {
    company: "Infra.Market",
    role: "Software Engineering Intern",
    period: "Feb 2023 — Jun 2023",
    location: "Hyderabad, India",
    current: false,
    bullets: [
      "Led revamp of legacy Customer Service codebase — audited and updated deprecated APIs, created new endpoints, ensured backward compatibility, and completed schema migrations.",
      "Acquired proficiency in Golang and TypeScript for application development.",
      "Won Moonshot Award at IM Hackathon 2023.",
    ],
  },
];

const education = {
  degree: "B.Tech — Computer Science & Engineering",
  institution: "Amrita Vishwa Vidyapeetham",
  grade: "8.06 CGPA",
  period: "2019 — 2023",
};

const skills: Record<string, string[]> = {
  "Languages & Frameworks": ["Go (Golang)", "TypeScript", "Python"],
  "Messaging & APIs": ["Apache Kafka", "gRPC", "RESTful APIs", "JWT"],
  Databases: ["PostgreSQL", "MySQL"],
  "System Design": [
    "Event-driven architecture",
    "Microservices",
    "Deduplication systems",
    "TDD authorship",
  ],
  Observability: ["Grafana", "New Relic", "Loggly", "Prometheus"],
  "CI/CD & VCS": ["GoCD", "Git", "Bitbucket"],
  Tools: ["JIRA", "Confluence", "Postman", "Agile/Scrum"],
};

export default function Experience() {
  return (
    <div className="min-h-screen px-6 md:px-12 lg:px-24 max-w-4xl mx-auto pt-28 pb-20">
      <div className="mb-12">
        <p className="text-xs font-mono text-muted uppercase tracking-widest mb-3">
          Background
        </p>
        <h1 className="text-3xl font-semibold text-text">Experience</h1>
      </div>

      {/* Timeline */}
      <div className="relative mb-20">
        <div className="absolute left-0 top-0 bottom-0 w-px bg-border ml-0 hidden md:block" />
        <div className="space-y-10">
          {experience.map((job, i) => (
            <div key={i} className="md:pl-8 relative">
              {/* dot */}
              <div className="hidden md:block absolute left-0 top-1.5 w-2 h-2 rounded-full border border-border bg-bg -translate-x-[3.5px]" />

              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-semibold text-text">
                      {job.role}
                    </h2>
                    {job.current && (
                      <span className="text-xs font-mono text-green border border-green/30 px-1.5 py-0.5 rounded">
                        current
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-subtle">{job.company}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-mono text-muted">{job.period}</p>
                  <p className="text-xs text-muted">{job.location}</p>
                </div>
              </div>

              <ul className="space-y-2">
                {job.bullets.map((b, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-subtle leading-relaxed">
                    <span className="text-muted flex-shrink-0 mt-0.5">—</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Education */}
      <div className="mb-16">
        <p className="text-xs font-mono text-muted uppercase tracking-widest mb-6">
          Education
        </p>
        <div className="border border-border rounded-lg p-6 bg-surface">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
            <div>
              <h3 className="text-base font-semibold text-text">
                {education.degree}
              </h3>
              <p className="text-sm text-subtle">{education.institution}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-mono text-muted">{education.period}</p>
              <p className="text-xs text-muted">{education.grade}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div>
        <p className="text-xs font-mono text-muted uppercase tracking-widest mb-6">
          Skills
        </p>
        <div className="space-y-4">
          {Object.entries(skills).map(([category, items]) => (
            <div key={category} className="flex flex-col sm:flex-row gap-2 sm:gap-6">
              <p className="text-xs font-mono text-muted w-full sm:w-44 flex-shrink-0 pt-1">
                {category}
              </p>
              <div className="flex flex-wrap gap-2">
                {items.map((item) => (
                  <span
                    key={item}
                    className="text-xs font-mono text-subtle border border-border px-2 py-0.5 rounded"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
