export const STATUE_NAME = "La veglia di Gotham";
export const STATUE_DESCRIPTION = "Statua di Batman in bronzo, scala 1:1";
export const STATUE_DIMENSIONS =
  "180 × 130 × 135 cm circa (A × L × P), base inclusa";
export const STATUE_PRICE = 12_900;
export const PREORDER_LABEL = "Preordina la statua";

const integerEuro = new Intl.NumberFormat("it-IT");

export function formatEuro(amount: number) {
  return `${integerEuro.format(amount)} €`;
}
