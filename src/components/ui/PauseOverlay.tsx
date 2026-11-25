import { useLayoutEffect } from "react";
export default function PauseOverlay() {
  useLayoutEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const transitions = document
      .querySelector(".experience-shell")
      ?.getAnimations({ subtree: true })
      .filter(
        (animation) =>
          "transitionProperty" in animation && animation.playState === "running",
      );
    transitions?.forEach((transition) => transition.pause());
    document
      .querySelector<HTMLButtonElement>(
        'button[aria-label="Riprendi esperienza"]',
      )
      ?.focus({ preventScroll: true });
    return () => {
      transitions?.forEach((transition) => {
        if (transition.playState === "paused") transition.play();
      });
      previous?.focus({ preventScroll: true });
    };
  }, []);
  return (
    <section
      className="ds-pause"
      aria-labelledby="pause-title"
      data-figma-node="402:2857"
    >
      <h1 id="pause-title" className="ds-display ds-purple">
        MISSIONE IN PAUSA
      </h1>
    </section>
  );
}
