import React from "react";

export default class SafeBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }
  static getDerivedStateFromError(err) {
    return { hasError: true, message: err?.message || "Error" };
  }
  componentDidCatch(err, info) {
    console.error("[SafeBoundary caught]", err, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="card pad" style={{ background: "#fef2f2", borderColor: "#fecaca" }}>
          <div style={{ color: "#b91c1c", fontWeight: 700, marginBottom: 6 }}>Chart failed to render</div>
          <div className="muted" style={{ color: "#7f1d1d" }}>{this.state.message}</div>
        </div>
      );
    }
    return this.props.children;
  }
}
