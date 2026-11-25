import { useEffect, useRef, useState } from "react";
import { Button, IconButton } from "../../components/ui/DesignSystem";

const STEPS = [
  [
    "389:8586",
    "Tre minuti",
    "Risolvi tutti gli enigmi prima che scada il tempo.",
  ],
  [
    "389:8585",
    "Risolvi gli enigmi",
    "Apri una carta e scegli la risposta giusta per raccogliere l’indizio.",
  ],
  [
    "389:8585",
    "Trova le cinque carte",
    "Cerca le carte del Joker nelle tre aree della Batcaverna.",
  ],
  [
    "389:8584",
    "Guardati intorno",
    "Porta il puntatore ai bordi dello schermo per ruotare la visuale.",
  ],
] as const;

export default function TutorialScreen({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [step, setStep] = useState(0);
  const last = step === STEPS.length - 1;
  const start = useRef<HTMLButtonElement>(null);
  const next = useRef<HTMLButtonElement>(null);
  const transferFocus = useRef(false);
  useEffect(() => {
    if (!transferFocus.current) return;
    (last ? start.current : next.current)?.focus();
    transferFocus.current = false;
  }, [last, step]);
  const [node, title, description] = STEPS[step];

  return (
    <section
      className="ds-tutorial ds-centered"
      data-figma-node="395:14910"
      aria-labelledby="tutorial-title"
    >
      <div
        className="ds-panel ds-secondary ds-tutorial-card"
        data-figma-node={node}
      >
        <header className="ds-tutorial-intro" data-figma-node="389:8524">
          <h1 id="tutorial-title" className="ds-heading-l ds-glow-text">
            ALLARME ALLA BATCAVERNA
          </h1>
          <p className="ds-body">
            Il Joker ha attivato una bomba nella Batcaverna.
          </p>
        </header>
        <div className="ds-tutorial-copy" aria-live="polite" aria-atomic="true">
          <h2 className="ds-body-space ds-bold ds-glow-text">{title}</h2>
          <p className="ds-body">{description}</p>
        </div>
        <div className="ds-tutorial-actions">
          {step > 0 && (
            <IconButton
              tone="secondary"
              icon="chevron-left"
              aria-label="Istruzione precedente"
              onClick={(event) => {
                transferFocus.current =
                  step === 1 && document.activeElement === event.currentTarget;
                setStep(step - 1);
              }}
            />
          )}
          {last ? (
            <Button ref={start} tone="secondary" onClick={onComplete}>
              Inizia la missione
            </Button>
          ) : (
            <IconButton
              tone="secondary"
              icon="chevron-right"
              ref={next}
              aria-label="Istruzione successiva"
              onClick={(event) => {
                transferFocus.current =
                  step === STEPS.length - 2 &&
                  document.activeElement === event.currentTarget;
                setStep(step + 1);
              }}
            />
          )}
        </div>
      </div>
    </section>
  );
}
