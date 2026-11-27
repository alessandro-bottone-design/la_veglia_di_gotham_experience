import { useCallback, useLayoutEffect, useRef, useState } from "react";

export const MISSION_SECONDS = 60;
const LIMIT_MS = MISSION_SECONDS * 1000;

export function useMissionTimer(
  run: number,
  running: boolean,
  onTimeUp: () => void,
) {
  const [timeLeft, setTimeLeft] = useState(MISSION_SECONDS);
  const elapsed = useRef(0);
  const started = useRef<number | null>(null);
  const result = useRef<number | null>(null);
  const expired = useRef(false);

  const elapsedNow = useCallback(() => {
    const current = started.current;
    return elapsed.current + (current === null ? 0 : performance.now() - current);
  }, []);

  const readClock = useCallback(() => {
    const ms = elapsedNow();
    setTimeLeft(Math.max(0, Math.ceil((LIMIT_MS - ms) / 1000)));
    if (ms >= LIMIT_MS && !expired.current) {
      expired.current = true;
      onTimeUp();
    }
    return ms;
  }, [elapsedNow, onTimeUp]);

  useLayoutEffect(() => {
    elapsed.current = 0;
    started.current = null;
    result.current = null;
    expired.current = false;
    setTimeLeft(MISSION_SECONDS);
  }, [run]);

  useLayoutEffect(() => {
    if (!running || result.current !== null || expired.current) return;
    started.current = performance.now();
    // Keep the displayed second aligned with the game clock after a pause.
    let timeout: ReturnType<typeof setTimeout>;
    const tick = () => {
      if (result.current !== null || expired.current) return;
      const ms = readClock();
      if (!expired.current) timeout = setTimeout(tick, 1000 - ms % 1000);
    };
    timeout = setTimeout(tick, 1000 - elapsed.current % 1000);
    return () => {
      clearTimeout(timeout);
      if (started.current !== null) {
        elapsed.current = elapsedNow();
        started.current = null;
      }
    };
  }, [elapsedNow, readClock, run, running]);

  const finish = useCallback(() => {
    if (result.current !== null || expired.current) return;
    const ms = readClock();
    if (ms >= LIMIT_MS) return;
    elapsed.current = ms;
    started.current = null;
    result.current = Math.floor(ms / 1000);
  }, [readClock]);

  const getResult = useCallback(() => result.current, []);
  const hasTime = useCallback(() => readClock() < LIMIT_MS, [readClock]);
  return { timeLeft, finish, getResult, hasTime };
}
