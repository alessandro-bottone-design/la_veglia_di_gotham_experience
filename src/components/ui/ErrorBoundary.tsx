import { Component, type ReactNode } from "react";
export default class ErrorBoundary extends Component<
  { children: ReactNode; onExit: () => void },
  { failed: boolean; retry: number }
> {
  state = { failed: false, retry: 0 };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <section className="result-screen">
        <h1>La Batcaverna non si apre</h1>
        <p>Il browser non riesce a mostrare il panorama.</p>
        <div className="action-row">
          <button
            onClick={() =>
              this.setState((s) => ({ failed: false, retry: s.retry + 1 }))
            }
          >
            Riprova
          </button>
          <button className="secondary" onClick={this.props.onExit}>
            Scopri la statua
          </button>
        </div>
      </section>
    ) : (
      <div key={this.state.retry}>{this.props.children}</div>
    );
  }
}
