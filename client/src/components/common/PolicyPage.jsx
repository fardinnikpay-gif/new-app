import { SHOW_LEGAL_NOTICE } from "../../data/policies";
import { formatDate } from "../../utils/format";
import Seo from "./Seo";
import PageHeader from "./PageHeader";
import Container from "../ui/Container";

// Shared layout for Terms and Privacy: section list on desktop, numbered sections.
export default function PolicyPage({ policy, seoDescription }) {
  const { title, updated, intro, sections } = policy;

  return (
    <>
      <Seo title={title} description={seoDescription} />
      <Container className="pb-16 md:pb-24">
        <PageHeader title={title} subtitle={`Last updated ${formatDate(updated)}`} />

        {SHOW_LEGAL_NOTICE && (
          <p
            role="note"
            className="mb-10 max-w-3xl rounded-md border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900"
          >
            This is sample text. Have it reviewed by a legal professional before you publish it.
          </p>
        )}

        <div className="grid gap-12 lg:grid-cols-[14rem_1fr] lg:gap-16">
          <nav aria-label="On this page" className="hidden lg:sticky lg:top-24 lg:block lg:self-start">
            <ol className="space-y-1 text-sm">
              {sections.map((section, index) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="flex min-h-11 items-center text-neutral-600 transition-colors hover:text-ink"
                  >
                    {index + 1}. {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="max-w-3xl space-y-10">
            {intro && <p className="text-lg text-neutral-600">{intro}</p>}
            {sections.map((section, index) => (
              <section key={section.id} id={section.id} className="scroll-mt-24">
                <h2 className="text-xl font-medium text-ink">
                  {index + 1}. {section.title}
                </h2>
                {section.paragraphs.map((text) => (
                  <p key={text} className="mt-3 text-neutral-600">
                    {text}
                  </p>
                ))}
              </section>
            ))}
          </div>
        </div>
      </Container>
    </>
  );
}