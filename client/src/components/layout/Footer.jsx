import { Link } from "react-router-dom";
import { FOOTER_GROUPS, SOCIAL_LINKS } from "../../data/navigation";
import { DEFAULT_DESCRIPTION, SITE_NAME } from "../../data/site";
import Container from "../ui/Container";
import SocialIcon from "./SocialIcon";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-surface">
      <Container className="grid gap-12 py-16 md:grid-cols-12">
        <div className="space-y-4 md:col-span-4">
          <Link to="/" className="text-xl font-medium tracking-tight">
            {SITE_NAME}
          </Link>
          <p className="max-w-xs text-sm text-neutral-500">{DEFAULT_DESCRIPTION}</p>
          <ul className="-ml-3 flex">
            {SOCIAL_LINKS.map((social) => (
              <li key={social.id}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${social.label} (opens in a new tab)`}
                  className="grid h-11 w-11 place-items-center rounded-lg transition-colors hover:bg-neutral-100"
                >
                  <SocialIcon name={social.id} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 md:col-span-8 md:grid-cols-4">
          {FOOTER_GROUPS.map((group) => (
            <div key={group.title}>
              <h2 className="mb-3 text-sm font-medium uppercase tracking-widest text-neutral-500">{group.title}</h2>
              <ul>
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="inline-flex min-h-9 items-center text-sm hover:text-primary">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </Container>

      <div className="border-t border-line">
        <Container className="py-6 text-sm text-neutral-500">
          &copy; {year} {SITE_NAME}. All rights reserved.
        </Container>
      </div>
    </footer>
  );
}