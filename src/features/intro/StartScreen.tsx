import { Button } from "../../components/ui/DesignSystem";
export default function StartScreen({ onStart }: { onStart: () => void }) {
  return (
    <section
      className="ds-start"
      data-figma-node="403:2924"
      aria-labelledby="start-title"
    >
      <div className="ds-start-stack" data-figma-node="402:2773">
        <div className="ds-start-title">
          <h1 id="start-title" className="ds-display ds-glow-text">
            La Veglia
            <br />
            di Gotham
          </h1>
        </div>
        <div className="ds-start-action">
          <Button onClick={onStart}>Entra nella Batcaverna</Button>
        </div>
      </div>
    </section>
  );
}
