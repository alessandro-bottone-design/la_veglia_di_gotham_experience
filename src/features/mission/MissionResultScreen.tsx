import { Button, Timer } from "../../components/ui/DesignSystem";

export default function MissionResultScreen({
  won,
  seconds,
  onContinue,
}: {
  won: boolean;
  seconds: number;
  onContinue: () => void;
}) {
  return (
    <section
      className="ds-centered"
      aria-labelledby="result-title"
      data-figma-node={won ? "302:1252" : "302:1251"}
    >
      <div
        className={
          "ds-panel ds-result " +
          (won ? "ds-result-win" : "ds-secondary ds-result-loss")
        }
      >
        <h1 id="result-title" className="ds-display">
          MISSIONE
          <br />
          {won ? "COMPIUTA" : "FALLITA"}
        </h1>
        <p className="ds-body">
          {won
            ? "Hai fermato il conto alla rovescia, Batman. Un applauso! E adesso, signore e signori, alziamo il sipario."
            : "Sipario, Batman! Il tempo è scaduto e della tua Batcaverna mi sa che resta solo il parcheggio."}
        </p>
        {won && <Timer seconds={seconds} tone="primary" />}
        <Button tone={won ? "primary" : "secondary"} onClick={onContinue}>
          {won ? "Scopri la statua" : "Riprova la missione"}
        </Button>
      </div>
    </section>
  );
}
