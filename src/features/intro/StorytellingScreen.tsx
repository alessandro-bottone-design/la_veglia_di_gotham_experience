import { useEffect, useRef, useState } from "react";
import { Button } from "../../components/ui/DesignSystem";
import { BatcavernAudio } from "../../lib/audioManager";

const CARD_PROMPT = "Gira la carta";
const STORY_MESSAGE =
  "Benvenuto al tuo spettacolo, Batman. Ho nascosto cinque carte nella tua Batcaverna. " +
  "Trovale e risolvi gli enigmi. Hai tre minuti, poi salto agli effetti speciali.";

export default function StorytellingScreen({
  onBegin,
  isPaused,
}: {
  onBegin: () => void;
  isPaused: boolean;
}) {
  const [flipped, setFlipped] = useState(false);
  const acceptRef = useRef<HTMLButtonElement>(null);
  const stopLaughRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (flipped && !isPaused) {
      acceptRef.current?.focus();
    }
  }, [flipped, isPaused]);

  useEffect(
    () => () => {
      stopLaughRef.current?.();
      stopLaughRef.current = null;
    },
    [],
  );

  function handleFlip() {
    if (isPaused || flipped) return;
    setFlipped(true);
    stopLaughRef.current?.();
    stopLaughRef.current = BatcavernAudio.spatialLaugh();
  }

  function handleAccept() {
    if (isPaused) return;
    stopLaughRef.current?.();
    stopLaughRef.current = null;
    onBegin();
  }

  return (
    <section
      className="ds-storytelling ds-centered"
      data-figma-node="395:15070"
      aria-label="Introduzione alla missione"
    >
      <div
        className="ds-story-card"
        data-face={flipped ? "back" : "front"}
        data-figma-node={flipped ? "389:10412" : "389:10413"}
      >
        <div className="ds-story-card-inner">
          <button
            type="button"
            className="ds-story-card-front"
            aria-label={CARD_PROMPT}
            disabled={flipped}
            aria-hidden={flipped}
            inert={flipped || undefined}
            onClick={handleFlip}
          >
            <span>
              <img src="/assets/ds/card-front.png" alt="" draggable={false} />
            </span>
          </button>
          <div
            className="ds-story-card-back"
            aria-hidden={!flipped}
            inert={!flipped || undefined}
          >
            <div className="ds-story-card-back-art" aria-hidden="true">
              <img src="/assets/ds/card-back.png" alt="" draggable={false} />
            </div>
            <div className="ds-story-card-content" data-figma-node="353:3223">
              {flipped && <h1 className="sr-only">Messaggio del Joker</h1>}
              <div className="ds-story-card-body" data-figma-node="353:3206">
                <p>{STORY_MESSAGE}</p>
              </div>
              <Button ref={acceptRef} tone="secondary" onClick={handleAccept}>
                Accetta la sfida
              </Button>
            </div>
          </div>
        </div>
      </div>
      {!flipped && (
        <div className="ds-story-subtitle" data-figma-node="353:3335">
          <h1 className="ds-heading ds-white">{CARD_PROMPT}</h1>
        </div>
      )}
    </section>
  );
}
