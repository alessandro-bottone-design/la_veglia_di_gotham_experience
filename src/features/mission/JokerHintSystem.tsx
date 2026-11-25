import { useEffect } from "react";
import { BatcavernAudio } from "../../lib/audioManager";
export default function JokerHintSystem({
  hintActive,
  hintPhase,
  isMuted,
  isPaused,
}: {
  hintActive: boolean;
  hintPhase: number;
  isMuted: boolean;
  isPaused: boolean;
}) {
  useEffect(() => {
    if (hintActive && !isMuted && !isPaused) BatcavernAudio.beep(440);
  }, [hintActive, isMuted, isPaused]);
  return hintActive && !isPaused ? (
    <p className="sr-only" role="status">
      Cerca la carta evidenziata o usa Tab per raggiungerla.{" "}
      <span className="sr-only">Aiuto {hintPhase}</span>
    </p>
  ) : null;
}
