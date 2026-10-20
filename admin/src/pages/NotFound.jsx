import { Compass } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";

export default function NotFound() {
  return (
    <EmptyState
      icon={Compass}
      title="Page not found"
      message="The page you are looking for does not exist or was moved."
      action={
        <Button as={Link} to="/dashboard">
          Back to dashboard
        </Button>
      }
    />
  );
}