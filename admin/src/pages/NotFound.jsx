import { Compass } from "lucide-react";
import { Link } from "react-router-dom";
import PageHeader from "../components/common/PageHeader";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";

export default function NotFound() {
  return (
    <>
      <PageHeader title="Page not found" />
      <EmptyState
        icon={Compass}
        title="This page does not exist"
        message="The link may be wrong or the page was moved."
        action={
          <Button as={Link} to="/dashboard">
            Back to dashboard
          </Button>
        }
      />
    </>
  );
}