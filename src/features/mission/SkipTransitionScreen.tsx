import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "../../components/ui/DesignSystem";

interface Props {
  src: string;
  onEnded: () => void;
  isPaused?: boolean;
  reducedMotion?: boolean;
  label?: string;
  nextAsset?: string;
}

export default function SkipTransitionScreen({
  src,
  onEnded,
  isPaused,
  reducedMotion,
  label = "Vai alla prossima area",
}: Props) {
  const video = useRef<HTMLVideoElement>(null);
  const done = useRef(false);
  const callback = useRef(onEnded);
  callback.current = onEnded;
  const [failed, setFailed] = useState(false);

  const finish = useCallback(() => {
    if (!done.current && !isPaused) {
      done.current = true;
      callback.current();
    }
  }, [isPaused]);

  useEffect(() => {
    if (reducedMotion || video.current?.ended) finish();
  }, [reducedMotion, finish]);

  useEffect(() => {
    const el = video.current;
    if (!el || reducedMotion) return;
    if (isPaused) el.pause();
    else if (!el.ended)
      void el.play().catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === "AbortError"))
          setFailed(true);
      });
  }, [isPaused, reducedMotion, src]);

  return (
    <section
      className="transition-player"
      data-figma-node="395:14722"
      aria-label="Transizione alla prossima area"
    >
      {!reducedMotion && !failed && (
        <video
          ref={video}
          src={src}
          muted
          playsInline
          onEnded={finish}
          onError={() => setFailed(true)}
        />
      )}
      <div className="ds-panel ds-secondary ds-skip-transition" data-figma-node="406:3223">
        <div className="ds-skip-transition-action" data-figma-node="405:3210">
          <Button tone="secondary" onClick={finish}>
            {label}
          </Button>
        </div>
      </div>
    </section>
  );
}
