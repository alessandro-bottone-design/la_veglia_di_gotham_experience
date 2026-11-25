import Navbar from "../../components/layout/Navbar";
import BatcaveBackdrop from "../../components/layout/BatcaveBackdrop";

export default function NotFoundScreen() {
  return (
    <div className="experience-shell" data-phase="not-found">
      <BatcaveBackdrop />
      <Navbar phase="not-found" />
      <main className="ds-centered">
        <section
          className="ds-panel ds-secondary ds-not-found"
          data-figma-node="401:976"
          aria-labelledby="error-title"
        >
          <h1 id="error-title" className="ds-display ds-glow-text">
            404
          </h1>
          <p className="ds-body">Pagina non trovata.</p>
          <a className="ds-button ds-button-big ds-secondary" href="/">
            Torna alla home
          </a>
        </section>
      </main>
    </div>
  );
}

