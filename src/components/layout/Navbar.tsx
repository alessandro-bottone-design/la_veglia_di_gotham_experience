import { useEffect, useRef, type RefObject } from "react";
import { Button, IconButton, Logos, Timer } from "../ui/DesignSystem";
import { MISSION_SECONDS } from "../../features/mission/useMissionTimer";
import { ORDER_LABEL } from "../../lib/statue";

export type NavPhase =
  | "start"
  | "loading"
  | "storytelling"
  | "tutorial"
  | "gamification"
  | "win"
  | "loss"
  | "showreel"
  | "checkout"
  | "thankyou"
  | "not-found";

type Props = {
  phase: NavPhase;
  isMuted?: boolean;
  onToggleMute?: () => void;
  isPaused?: boolean;
  onTogglePause?: () => void;
  onOrder?: () => void;
  completedCount?: number;
  timeLeft?: number;
  progressTrack?: RefObject<HTMLSpanElement | null>;
};

export default function Navbar({
  phase,
  isMuted = false,
  onToggleMute,
  isPaused = false,
  onTogglePause,
  onOrder,
  completedCount = 0,
  timeLeft = MISSION_SECONDS,
  progressTrack,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const nav = ref.current;
    const shell = nav?.parentElement;
    if (!nav || !shell) return;
    const update = () =>
      shell.style.setProperty("--nav-height", nav.offsetHeight + "px");
    const observer = new ResizeObserver(update);
    observer.observe(nav);
    update();
    return () => {
      observer.disconnect();
      shell.style.removeProperty("--nav-height");
    };
  }, []);
  const showHud = phase === "gamification" || phase === "tutorial";
  const showMute = Boolean(onToggleMute) && phase !== "not-found";
  const showPause = phase === "gamification" && Boolean(onTogglePause);

  return (
    <nav
      ref={ref}
      className="ds-navbar"
      aria-label="Controlli esperienza"
      data-figma-node="395:14599"
    >
      <div className="ds-navbar-left">
        <Logos />
        {showHud && (
          <div className="ds-hud">
            <Timer seconds={timeLeft} small />
            <div
              className="ds-clue-progress"
              role="progressbar"
              aria-label="Indizi raccolti"
              aria-valuemin={0}
              aria-valuemax={5}
              aria-valuenow={completedCount}
              data-figma-node="395:14486"
            >
              <span className="ds-body-small-space">INDIZI RACCOLTI</span>
              <div>
                <span className="ds-caption">{completedCount} / 5</span>
                <span className="ds-progress-track" ref={progressTrack}>
                  <span
                    className="ds-progress-fill"
                    style={{ width: `${completedCount * 20}%` }}
                  />
                  {completedCount > 0 && (
                    <span key={completedCount} className="ds-progress-pulse" />
                  )}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
      {(onOrder || showMute || showPause) && (
        <div className="ds-navbar-actions">
          {onOrder && (
            <Button size="small" onClick={onOrder}>
              {ORDER_LABEL}
            </Button>
          )}
          {showMute && (
            <IconButton
              icon={isMuted ? "audio-off" : "audio-on"}
              aria-label={isMuted ? "Attiva audio" : "Silenzia audio"}
              aria-pressed={isMuted}
              onClick={onToggleMute}
              data-ui-sound="custom"
            />
          )}
          {showPause && (
            <IconButton
              icon={isPaused ? "play" : "pause"}
              aria-label={
                isPaused ? "Riprendi esperienza" : "Metti in pausa esperienza"
              }
              aria-pressed={isPaused}
              onClick={onTogglePause}
            />
          )}
        </div>
      )}
    </nav>
  );
}
