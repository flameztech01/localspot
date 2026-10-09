import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error("🔥 ErrorBoundary caught:", error);
    // eslint-disable-next-line no-console
    console.error("Component stack:", info?.componentStack);
    this.setState({ info });
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24, fontFamily: "monospace", background: "#fee", minHeight: "100vh" }}>
          <h1 style={{ color: "#b91c1c", fontSize: 20 }}>💥 App crashed</h1>
          <p style={{ marginTop: 8, fontWeight: "bold" }}>{String(this.state.error?.message)}</p>
          <pre style={{ marginTop: 16, background: "#fff", padding: 16, borderRadius: 8, overflow: "auto", fontSize: 11, maxHeight: 400 }}>
            {this.state.info?.componentStack || this.state.error?.stack}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{ marginTop: 16, padding: "10px 20px", background: "#3B82F6", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;