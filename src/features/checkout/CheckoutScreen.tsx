import { useEffect, useRef, useState, type FormEvent } from "react";
import FormInput from "../../components/ui/FormInput";
import { Button, IconButton } from "../../components/ui/DesignSystem";
import { formatEuro, STATUE_NAME, STATUE_PRICE } from "../../lib/statue";

const PERSONAL = [
  ["phone", "Numero di telefono", "+39 000 000 000"],
  ["fullName", "Nome e cognome", "Bruce Wayne"],
  ["email", "Email", "bruce.wayne@example.com"],
  ["birthDate", "Data di nascita", "19/02/1980"],
  ["password", "Password", "••••••••"],
] as const;
const SHIPPING_FIELDS = [
  ["region", "Regione", "Campania"],
  ["provincia", "Provincia", "NA"],
  ["city", "Città", "Napoli"],
  ["cap", "CAP", "80125"],
  ["address", "Indirizzo", "Villa Wayne, 1"],
] as const;
const CARD = [
  ["cardOwner", "Intestatario", "Bruce Wayne"],
  ["cardNumber", "Numero carta", "•••• •••• •••• 4242"],
  ["cardExpiry", "Data di scadenza", "••/••"],
  ["cardCvv", "CVV", "•••"],
] as const;
const PAYMENT_METHODS = [
  ["paypal", "PayPal"],
  ["card", "Carta di credito o debito"],
] as const;
const STEPS = [
  {
    id: "395:14435",
    name: "personal",
    title: "Dati personali",
  },
  {
    id: "395:14435",
    name: "shipping",
    title: "Dati di spedizione",
  },
  {
    id: "395:14436",
    name: "payment",
    title: "Metodo di pagamento",
  },
  { id: "395:14437", name: "order", title: "Riepilogo" },
] as const;
type Field = readonly [name: string, label: string, value: string];
type PaymentMethod = (typeof PAYMENT_METHODS)[number][0];

export default function CheckoutScreen({
  onSuccess,
}: {
  onSuccess: (quantity: number, total: number) => void;
}) {
  const [step, setStep] = useState(0);
  const [method, setMethod] = useState<PaymentMethod>("paypal");
  const [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const form = useRef<HTMLFormElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const nextButton = useRef<HTMLButtonElement>(null);
  const backButton = useRef<HTMLButtonElement>(null);
  const current = STEPS[step];
  const isOrder = current.name === "order";

  useEffect(
    () => () => {
      if (timer.current !== null) clearTimeout(timer.current);
    },
    [],
  );

  useEffect(() => {
    heading.current?.focus();
  }, [step]);

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if (
        event.defaultPrevented ||
        event.repeat ||
        event.isComposing ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey
      )
        return;
      const target = event.target instanceof Element ? event.target : null;
      if (
        target?.closest(
          'input, textarea, select, [contenteditable], a, [role="button"]',
        )
      )
        return;
      const focusedButton = target?.closest("button");
      if (
        focusedButton &&
        (!form.current?.contains(focusedButton) || event.key === " ")
      )
        return;
      const button =
        event.key === "ArrowLeft"
          ? backButton.current
          : event.key === "ArrowRight" || event.key === " "
            ? nextButton.current
            : null;
      if (!button || button.disabled) return;
      event.preventDefault();
      button.click();
    }

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  function advance(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (timer.current !== null) return;

    if (!isOrder) {
      setStep(step + 1);
      return;
    }

    setLoading(true);
    timer.current = setTimeout(() => {
      onSuccess(1, STATUE_PRICE);
    }, 4000);
  }

  const field = ([name, label, value]: Field) => (
    <FormInput key={name} name={name} label={label} value={value} readOnly />
  );

  return (
    <section
      className="ds-checkout"
      data-figma-node="395:15069"
      aria-labelledby="checkout-title"
    >
      <h1 id="checkout-title" className="ds-display">
        Preordine
      </h1>
      <p id="checkout-navigation" className="ds-checkout-notice">
        Usa le frecce per cambiare tappa o premi Spazio per avanzare.
      </p>
      <form
        ref={form}
        noValidate
        autoComplete="off"
        onSubmit={advance}
        className={"ds-panel ds-checkout-card ds-checkout-" + current.name}
        aria-labelledby="checkout-step-title"
        aria-describedby="checkout-navigation"
        data-figma-node={current.id}
      >
        <h2
          id="checkout-step-title"
          ref={heading}
          tabIndex={-1}
          className="ds-heading ds-glow-text"
        >
          {current.title}
        </h2>
        {current.name === "personal" && (
          <div className="ds-checkout-grid">{PERSONAL.map(field)}</div>
        )}
        {current.name === "shipping" && (
          <div className="ds-checkout-grid">{SHIPPING_FIELDS.map(field)}</div>
        )}
        {current.name === "payment" && (
          <fieldset className="ds-payment">
            <legend className="sr-only">Metodo di pagamento</legend>
            {PAYMENT_METHODS.map(([value, label]) => (
              <div key={value} className="ds-payment-option">
                <label className="ds-payment-label">
                  <span className="ds-radio-slot">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={value}
                      checked={method === value}
                      onChange={() => setMethod(value)}
                    />
                  </span>
                  <span className="ds-body-small-space ds-bold ds-glow-text">
                    {label}
                  </span>
                </label>
                {value === "card" && method === "card" && (
                  <div className="ds-card-fields" data-figma-node="392:13958">
                    {CARD.map(field)}
                  </div>
                )}
              </div>
            ))}
          </fieldset>
        )}
        {isOrder && (
          <dl className="ds-order-summary">
            <div>
              <dt>{STATUE_NAME}</dt>
              <dd>{formatEuro(STATUE_PRICE)}</dd>
            </div>
            <div>
              <dt>Trasporto</dt>
              <dd>Incluso</dd>
            </div>
            <div>
              <dt>Totale</dt>
              <dd>{formatEuro(STATUE_PRICE)}</dd>
            </div>
          </dl>
        )}
        <div className="ds-checkout-actions">
          {step > 0 && (
            <IconButton
              ref={backButton}
              icon="chevron-left"
              aria-label="Tappa precedente"
              disabled={loading}
              onClick={() => setStep(step - 1)}
            />
          )}
          {isOrder ? (
            <Button ref={nextButton} disabled={loading} type="submit">
              Conferma il preordine
            </Button>
          ) : (
            <IconButton
              ref={nextButton}
              icon="chevron-right"
              aria-label="Tappa successiva"
              type="submit"
            />
          )}
        </div>
        {loading && (
          <p role="status" className="sr-only">
            Conferma del preordine in corso.
          </p>
        )}
      </form>
    </section>
  );
}
