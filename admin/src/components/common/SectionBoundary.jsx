import { Component } from "react";
import ErrorState from "../ui/ErrorState";

// Isolates a render crash to one section. It resets itself when `resetKey`
// changes (e.g. fresh data arrived), so "Try again" = refetch + re-render.
export default class SectionBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error(`[${this.props.label}] failed to render`, error);
  }

  componentDidUpdate(prevProps) {
    if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    const { label, onRetry } = this.props;
    return (
      <ErrorState
        title={`${label} unavailable`}
        message="This section could not be displayed."
        onRetry={onRetry}
      />
    );
  }
}