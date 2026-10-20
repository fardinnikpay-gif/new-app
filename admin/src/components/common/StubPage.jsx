import { Construction } from "lucide-react";
import EmptyState from "../ui/EmptyState";
import PageHeader from "./PageHeader";

// TEMPORARY: replaced page by page in steps 4-9.
export default function StubPage({ title, step }) {
  return (
    <>
      <PageHeader title={title} />
      <EmptyState
        icon={Construction}
        title="Coming soon"
        message={`This page is built in step ${step}.`}
      />
    </>
  );
}