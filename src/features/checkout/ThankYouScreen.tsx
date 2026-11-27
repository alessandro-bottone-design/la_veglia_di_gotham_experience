import { Button } from "../../components/ui/DesignSystem";
import type { Order } from "../../lib/experience";
import { formatEuro, STATUE_NAME } from "../../lib/statue";

export default function ThankYouScreen({
  order,
  onReturnHome,
}: {
  order: Order;
  onReturnHome: () => void;
}) {
  const items = [
    ["Numero ordine", "ord-bw-4019"],
    ["Prodotto", STATUE_NAME],
    ["Quantità", order.quantity],
    ["Totale", formatEuro(order.total)],
    ["Consegna", "Da concordare"],
  ];

  return (
    <section
      className="ds-thankyou ds-centered"
      data-figma-node="395:14652"
      aria-labelledby="thankyou-title"
    >
      <div className="ds-panel ds-thankyou-card" data-figma-node="243:3817">
        <header>
          <h1 id="thankyou-title" className="ds-display ds-glow-text">
            Ordine
            <br />
            confermato
          </h1>
        </header>
        <dl>
          {items.map(([label, value]) => (
            <div key={label}>
              <dt className="ds-heading ds-glow-text">{label}</dt>
              <dd className="ds-body">{value}</dd>
            </div>
          ))}
        </dl>
        <Button onClick={onReturnHome}>Torna alla home</Button>
      </div>
    </section>
  );
}
