import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";
import { Button, LoadingScreen } from "../../components/ui/DesignSystem";
import {
  PREORDER_LABEL,
  STATUE_DESCRIPTION,
  STATUE_DIMENSIONS,
  STATUE_NAME,
} from "../../lib/statue";

import {
  frameSource,
  mountScrollSequence,
  SHOWREEL_POSTER,
} from "./scrollSequence";

const QUALITIES = [
  [
    "404:3118",
    "right",
    "Bronzo a cera persa",
    "La fusione cava a cera persa riprende anche le pieghe più strette del mantello, dove si raccoglie sul petto.",
    [0.03, 0.07, 0.24, 0.29],
  ],
  [
    "404:3133",
    "left",
    "La posa sul gargoyle",
    "Batman è accovacciato, con il busto proteso in avanti e una mano sulla testa del gargoyle.",
    [0.34, 0.38, 0.54, 0.59],
  ],
  [
    "404:3140",
    "right",
    "Patina bruna",
    "I bordi del guanto riflettono più luce. Nelle rientranze il bronzo resta più scuro.",
    [0.65, 0.69, 0.84, 0.89],
  ],
] as const;

const FINAL_FADE = [0.93, 0.97] as const;

function ScrollOverlay({
  progress,
  stops,
  className,
  node,
  staticView = false,
  children,
}: {
  progress: MotionValue<number>;
  stops: readonly [number, number] | readonly [number, number, number, number];
  className: string;
  node: string;
  staticView?: boolean;
  children: ReactNode;
}) {
  const opacity = useTransform(
    progress,
    [...stops],
    stops.length === 4 ? [0, 1, 1, 0] : [0, 1],
  );
  const visibility = useTransform(opacity, (value) =>
    value > 0 ? "visible" : "hidden",
  );
  return (
    <motion.div
      className={`ds-showreel-overlay ${className}`}
      data-figma-node={node}
      style={staticView ? undefined : { opacity, visibility }}
    >
      {children}
    </motion.div>
  );
}

export default function ShowreelScreen({
  onPreorder,
}: {
  onPreorder?: () => void;
}) {
  const reduced = !!useReducedMotion();
  const container = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const progress = useMotionValue(0);
  const hintOpacity = useTransform(progress, [0, 0.02], [1, 0]);
  const hintVisibility = useTransform(hintOpacity, (value) =>
    value > 0 ? "visible" : "hidden",
  );
  const [finalReady, setFinalReady] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    if (reduced || !canvas.current || !container.current || !stage.current)
      return;

    setLoaded(false);
    setFailed(false);
    return mountScrollSequence({
      canvas: canvas.current,
      track: container.current,
      stage: stage.current,
      onProgress: (value) => {
        progress.set(value);
        setFinalReady(value >= FINAL_FADE[1]);
      },
      onReady: () => {
        setLoaded(true);
        setFailed(false);
      },
      onUnavailable: () => setFailed(true),
    });
  }, [progress, reduced, retry]);

  return (
    <div
      ref={container}
      className={reduced ? "ds-statue-static" : "statue-scroll"}
    >
      <section
        ref={stage}
        className="statue-stage"
        aria-label="Presentazione della statua di Batman"
      >
        <div className="ds-showreel-media">
          {reduced ? (
            <img
              className="ds-statue-poster"
              src={
                frameSource(SHOWREEL_POSTER) + (retry ? "?retry=" + retry : "")
              }
              alt="Batman accovacciato sul gargoyle"
              onLoad={() => setLoaded(true)}
              onError={() => setFailed(true)}
            />
          ) : (
            <canvas
              ref={canvas}
              aria-label="Dettagli della statua di Batman"
              role="img"
            />
          )}
        </div>
        {!reduced && loaded && (
          <motion.p
            className="ds-showreel-hint"
            style={{ opacity: hintOpacity, visibility: hintVisibility }}
          >
            Scorri per vedere la statua ↓
          </motion.p>
        )}
        {!reduced &&
          QUALITIES.map(([node, align, title, description, stops]) => (
            <ScrollOverlay
              key={node}
              progress={progress}
              stops={stops}
              className={`ds-showreel-step ds-showreel-${align}`}
              node={node}
            >
              <div
                className="ds-panel ds-primary ds-showreel-card"
                data-figma-node="241:3517"
              >
                <h2 className="ds-heading-l">{title}</h2>
                <p className="ds-body">{description}</p>
              </div>
            </ScrollOverlay>
          ))}
        <ScrollOverlay
          progress={progress}
          stops={FINAL_FADE}
          className="ds-showreel-final"
          node="404:3125"
          staticView={reduced}
        >
          <h1 className="ds-display ds-glow-text">{STATUE_NAME}</h1>
          <div className="ds-showreel-facts">
            <p>{STATUE_DESCRIPTION}</p>
            <p>{STATUE_DIMENSIONS}</p>
          </div>
          <Button
            onClick={onPreorder}
            disabled={!reduced && (!loaded || !finalReady)}
          >
            {PREORDER_LABEL}
          </Button>
          {reduced && (
            <ul className="sr-only">
              {QUALITIES.map(([id, , title, description]) => (
                <li key={id}>
                  {title}. {description}
                </li>
              ))}
            </ul>
          )}
        </ScrollOverlay>
        {!loaded &&
          (failed ? (
            <div className="statue-loading" role="status">
              <p>Il browser non riesce a caricare le immagini della statua.</p>
              <button
                onClick={() => {
                  setFailed(false);
                  setRetry((r) => r + 1);
                }}
              >
                Riprova
              </button>
            </div>
          ) : (
            <LoadingScreen
              className="statue-loading"
              srLabel="Caricamento delle immagini della statua…"
            />
          ))}
      </section>
    </div>
  );
}
