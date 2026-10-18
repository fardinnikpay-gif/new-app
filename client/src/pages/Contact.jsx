import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { contactInfo } from "../data/contact";
import { buildMailto } from "../utils/mailto";
import { contactSchema } from "../utils/validators";
import Seo from "../components/common/Seo";
import PageHeader from "../components/common/PageHeader";
import Reveal from "../components/motion/Reveal";
import Button from "../components/ui/Button";
import Container from "../components/ui/Container";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";

const FORM_DELAY_S = 0.15;

const infoRows = [
  { icon: Mail, label: "Email", value: contactInfo.email, href: `mailto:${contactInfo.email}` },
  {
    icon: Phone,
    label: "Phone",
    value: contactInfo.phone,
    href: `tel:${contactInfo.phone.replace(/[^\d+]/g, "")}`,
  },
  { icon: MapPin, label: "Address", value: contactInfo.address },
  { icon: Clock, label: "Opening hours", value: contactInfo.hours },
];

export default function Contact() {
  // There is no backend endpoint for contact messages, so the form opens the visitor's email app.
  const [mailtoHref, setMailtoHref] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  const onSubmit = (values) => {
    const body = `${values.message}\n\n— ${values.name} (${values.email})`;
    const href = buildMailto({ to: contactInfo.email, subject: values.subject, body });
    setMailtoHref(href);
    window.location.assign(href);
  };

  const writeAnother = () => {
    reset();
    setMailtoHref("");
  };

  return (
    <>
      <Seo title="Contact us" description="Get in touch with our team." />
      <Container className="pb-16 md:pb-24">
        <PageHeader
          eyebrow="Contact"
          title="Get in touch"
          subtitle="Questions about an order, sizing or anything else? We're happy to help."
        />

        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <Reveal>
            <dl className="space-y-6">
              {infoRows.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex gap-4">
                  <Icon className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <dt className="text-sm text-neutral-600">{label}</dt>
                    <dd className="text-ink">
                      {href ? (
                        <a href={href} className="inline-flex min-h-11 items-center hover:underline">
                          {value}
                        </a>
                      ) : (
                        value
                      )}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={FORM_DELAY_S}>
            {mailtoHref ? (
              <div role="status" className="space-y-4 rounded-lg bg-neutral-100 p-6">
                <p className="font-medium text-ink">Your email app should now be open.</p>
                <p className="text-sm text-neutral-600">
                  Your message is ready to send. It is only sent once you press Send in your email app.
                  If nothing opened, use the link below or email us directly at {contactInfo.email}.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button as="a" href={mailtoHref}>
                    Open email app
                  </Button>
                  <Button variant="outline" onClick={writeAnother}>
                    Write another message
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Input
                    label="Your name"
                    autoComplete="name"
                    error={errors.name?.message}
                    {...register("name")}
                  />
                  <Input
                    label="Your email"
                    type="email"
                    autoComplete="email"
                    error={errors.email?.message}
                    {...register("email")}
                  />
                </div>
                <Input label="Subject" error={errors.subject?.message} {...register("subject")} />
                <Textarea label="Message" rows={6} error={errors.message?.message} {...register("message")} />
                <Button type="submit" size="lg">
                  Send message
                </Button>
                <p className="text-sm text-neutral-600">
                  This opens your email app with your message ready to send.
                </p>
              </form>
            )}
          </Reveal>
        </div>
      </Container>
    </>
  );
}