import { Mail, Github, Linkedin, MapPin } from "lucide-react";

const links = [
  {
    label: "Email",
    value: "aadithsuresh10@gmail.com",
    href: "mailto:aadithsuresh10@gmail.com",
    icon: Mail,
  },
  {
    label: "GitHub",
    value: "github.com/AadithS13",
    href: "https://github.com/AadithS13",
    icon: Github,
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/aadith-s",
    href: "https://linkedin.com/in/aadith-s",
    icon: Linkedin,
  },
];

export default function Contact() {
  return (
    <div className="min-h-screen px-6 md:px-12 lg:px-24 max-w-4xl mx-auto pt-28 pb-20">
      <div className="mb-12">
        <p className="text-xs font-mono text-muted uppercase tracking-widest mb-3">
          Get in touch
        </p>
        <h1 className="text-3xl font-semibold text-text">Contact</h1>
        <p className="text-subtle mt-2 text-sm max-w-lg">
          Open to backend engineering roles, interesting side projects, and
          technical conversations. Response time: usually same day.
        </p>
      </div>

      {/* Location */}
      <div className="flex items-center gap-2 text-sm text-muted mb-10">
        <MapPin size={14} />
        <span>Bengaluru, India</span>
      </div>

      {/* Contact links */}
      <div className="space-y-px">
        {links.map(({ label, value, href, icon: Icon }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith("mailto") ? undefined : "_blank"}
            rel={href.startsWith("mailto") ? undefined : "noopener noreferrer"}
            className="group flex items-center justify-between border border-border rounded-lg p-5 hover:border-muted bg-surface transition-colors"
          >
            <div className="flex items-center gap-4">
              <span className="text-muted group-hover:text-text transition-colors">
                <Icon size={16} />
              </span>
              <div>
                <p className="text-xs font-mono text-muted uppercase tracking-widest mb-0.5">
                  {label}
                </p>
                <p className="text-sm text-subtle group-hover:text-text transition-colors">
                  {value}
                </p>
              </div>
            </div>
            <span className="text-muted group-hover:text-text transition-colors text-lg">
              ↗
            </span>
          </a>
        ))}
      </div>

      {/* Footer note */}
      <div className="mt-16 pt-8 border-t border-border">
        <p className="text-xs font-mono text-muted">
          Currently based in Bengaluru · Available for remote or hybrid roles
        </p>
      </div>
    </div>
  );
}
