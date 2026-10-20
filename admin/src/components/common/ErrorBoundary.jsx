import { Component } from "react";
import ErrorFallback from "./ErrorFallback";

// Last line of defense: a render error that no section-level boundary caught ends up here,
// so the admin sees a recoverable screen instead of a blank page.
export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    // Never store a falsy value: it would look like "no error" and re-render the broken tree.
    return { error: error ?? new Error("Unknown error") };
  }

  componentDidCatch(error, info) {
    // No external logging service is configured, so the console is the only sink for now.
    console.error("Unhandled UI error", error, info.componentStack);
  }

  render() {
    if (this.state.error) return <ErrorFallback error={this.state.error} />;
    return this.props.children;
  }
}