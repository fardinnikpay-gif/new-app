import { authContent } from "../../data/authContent";
import Reveal from "../motion/Reveal";

// Two columns on desktop (image + form), single column on phone and tablet.
export default function AuthLayout({ title, subtitle, children, footer }) {
  const { image, tagline } = authContent;

  return (
    <div className="grid min-h-[calc(100svh-var(--spacing-header))] lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <img
          src={image.src}
          alt=""
          aria-hidden="true"
          width={image.width}
          height={image.height}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-ink/30" />
        <p className="absolute inset-x-10 bottom-10 text-3xl font-light tracking-tight text-white">
          {tagline}
        </p>
      </div>

      <div className="flex items-center justify-center px-4 py-12 md:px-8 md:py-16">
        <Reveal className="w-full max-w-md">
          <h1 className="text-3xl font-light tracking-tight text-ink md:text-4xl">{title}</h1>
          {subtitle && <p className="mt-3 text-neutral-600">{subtitle}</p>}
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-8 text-center text-sm text-neutral-600">{footer}</div>}
        </Reveal>
      </div>
    </div>
  );
}