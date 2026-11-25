import { test, expect, type Page, type Request } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test.beforeEach(async ({ page }) => {
  await page.route("https://vercel.live/**", (route) => route.abort());
});
async function enterStory(page: Page) {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Entra nella Batcaverna", exact: true })
    .click();
}
async function enterTutorial(page: Page) {
  await enterStory(page);
  await page
    .getByRole("button", {
      name: "Gira la carta",
      exact: true,
    })
    .click();
  await page
    .getByRole("button", { name: "Accetta la sfida", exact: true })
    .click();
}
async function beginMission(page: Page) {
  const next = page.getByRole("button", { name: "Istruzione successiva" });
  for (let i = 0; i < 3; i++) await next.click();
  await page
    .getByRole("button", { name: "Inizia la missione", exact: true })
    .click();
}
async function start(page: Page, reduced = true) {
  await page.emulateMedia({
    reducedMotion: reduced ? "reduce" : "no-preference",
  });
  await enterTutorial(page);
  await beginMission(page);
  await expect(
    page.getByRole("button", { name: "Raggiungi indizio 1", exact: true }),
  ).toBeEnabled();
}
async function reach(page: Page, id: number) {
  const target = page.getByRole("button", {
    name: "Raggiungi indizio " + id,
    exact: true,
  });
  await expect(target).toBeEnabled({ timeout: 45000 });
  await target.focus();
  const front = page.getByRole("button", {
    name: "Apri indizio " + id,
    exact: true,
  });
  await expect(front).toBeFocused();
  await front.press("Enter");
  await expect(page.locator('[data-clue-id="' + id + '"]')).toHaveAttribute(
    "data-face",
    "back",
  );
}
async function answer(page: Page, id: number, response: string) {
  await reach(page, id);
  await page.getByRole("button", { name: response, exact: true }).click();
  await expect(page.locator('[data-clue-id="' + id + '"]')).toHaveCount(0, {
    timeout: 45000,
  });
}
const checkoutFieldNames = [
  "phone", "fullName", "email", "birthDate", "password",
  "region", "provincia", "city", "cap", "address",
  "cardOwner", "cardNumber", "cardExpiry", "cardCvv",
];
function observeCheckoutRequests(page: Page) {
  const requests: Request[] = [];
  page.on("request", (request) => requests.push(request));
  return requests;
}
async function expectLocalCheckout(page: Page, requests: Request[]) {
  const sampleValues = ["Bruce Wayne", "bruce.wayne@", "4242"];
  const outgoingData = requests
    .filter((request) => {
      const url = new URL(request.url());
      if (url.origin === "https://vercel.live") return false;
      const address = decodeURIComponent(url.href.replaceAll("+", " "));
      return (
        !["GET", "HEAD"].includes(request.method()) ||
        request.postData() !== null ||
        checkoutFieldNames.some((name) => url.searchParams.has(name)) ||
        sampleValues.some((value) => address.includes(value))
      );
    })
    .map((request) => request.url());
  expect(outgoingData).toEqual([]);
  expect(new URL(page.url()).search).toBe("");
  expect(
    await page.evaluate(() => [localStorage.length, sessionStorage.length]),
  ).toEqual([0, 0]);
}
async function reachOrderSummary(page: Page, card = false) {
  const next = page.getByRole("button", { name: "Tappa successiva" });
  await next.click();
  await next.click();
  await page
    .getByRole("radio", {
      name: card ? "Carta di credito o debito" : "PayPal",
      exact: true,
    })
    .check();
  await next.click();
}
const BATCOMPUTER_VIDEO = "/assets/textures/BatCaverna_Batcomputer360.mp4";
const BATCOMPUTER_PERSPECTIVE =
  "/assets/textures/BatCaverna_BatcomputerPerspective.jpg";
const backdrop = (page: Page) => page.locator(".batcave-backdrop");
const responses = ["BAT SEGNALE", "JOKER", "BATMAN", "BATMOBILE", "REATTORE"];
test("official start has original assets, tokens and an inert decorative video", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  const media: string[] = [];
  page.on("request", (r) => {
    if (/\.(mp4|wav)(\?|$)/.test(r.url())) media.push(r.url());
  });
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "La Veglia di Gotham" }),
  ).toBeVisible();
  await expect(page.locator("nav").getByRole("button")).toHaveCount(2);
  await expect(page.locator(".ds-start-title")).toHaveCSS(
    "font-family",
    /Poppins/,
  );
  const computed = await page.locator("h1").evaluate((el) => ({
    color: getComputedStyle(el).color,
    family: getComputedStyle(el).fontFamily,
    size: getComputedStyle(el).fontSize,
    lineHeight: getComputedStyle(el).lineHeight,
    background: getComputedStyle(document.documentElement).backgroundColor,
  }));
  expect(computed).toMatchObject({
    color: "rgb(255, 215, 0)",
    size: "80px",
    lineHeight: "88px",
    background: "rgb(1, 0, 19)",
  });
  expect(computed.family).toContain("Space Grotesk");
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator(".ds-logos img")).toHaveCount(3);
  await expect
    .poll(() =>
      page
        .locator(".ds-logos img")
        .evaluateAll((els) =>
          els.every(
            (el) =>
              (el as HTMLImageElement).complete &&
              (el as HTMLImageElement).naturalWidth > 0,
          ),
        ),
    )
    .toBe(true);
  const video = backdrop(page).locator("video");
  await expect(video).toHaveAttribute("src", BATCOMPUTER_VIDEO);
  await expect(video).toHaveJSProperty("muted", true);
  await expect(video).toHaveJSProperty("controls", false);
  await expect(backdrop(page)).toHaveAttribute("inert", "");
  await expect(backdrop(page)).toHaveCSS("pointer-events", "none");
  await expect(backdrop(page).locator("canvas")).toBeVisible();
  expect(
    media.every((url) => new URL(url).pathname === BATCOMPUTER_VIDEO),
  ).toBe(true);
  await page.mouse.move(1910, 1070);
  await page.screenshot({ path: test.info().outputPath("start.png") });
});
test("storytelling flips the Joker relic card, hides the guide subtitle and advances to tutorial", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Entra nella Batcaverna", exact: true })
    .click();
  await expect(page.getByRole("progressbar")).toHaveCount(0);
  await expect(backdrop(page).locator("video")).toHaveAttribute(
    "src",
    BATCOMPUTER_VIDEO,
  );
  const card = page.locator(".ds-story-card");
  await expect(card).toHaveAttribute("data-face", "front");
  await expect(page.getByRole("heading")).toContainText(
    "Gira la carta",
  );
  await page.getByRole("button", { name: "Metti in pausa esperienza" }).click();
  await expect(
    page.getByRole("heading", { name: "MISSIONE IN PAUSA" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Riprendi esperienza" }).click();
  await expect(card).toHaveAttribute("data-face", "front");
  await page
    .getByRole("button", {
      name: "Gira la carta",
      exact: true,
    })
    .click();
  await expect(card).toHaveAttribute("data-face", "back");
  await expect(
    page.getByRole("heading", { name: /Gira la carta/ }),
  ).toHaveCount(0);
  await expect(page.locator(".ds-story-card-body")).toContainText(
    "Benvenuto al tuo spettacolo, Batman.",
  );
  const accept = page.getByRole("button", {
    name: "Accetta la sfida",
    exact: true,
  });
  await expect(accept).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  await expect.poll(async () => {
    return page.locator(".ds-story-card-back").evaluate((back) => {
      const art = back.querySelector(".ds-story-card-back-art")!;
      const message = back.querySelector(".ds-story-card-body")!;
      const button = back.querySelector(".ds-button")!;
      const artwork = art.getBoundingClientRect();
      const text = message.getBoundingClientRect();
      const action = button.getBoundingClientRect();
      return text.top >= artwork.top + 20 && action.bottom <= artwork.bottom - 20;
    });
  }).toBe(true);
  await accept.click();
  await expect(
    page.getByRole("heading", { name: "Tre minuti" }),
  ).toBeVisible();
  await enterTutorial(page);
  await expect(
    page.getByRole("heading", { name: "Tre minuti" }),
  ).toBeVisible();
});
test("tutorial uses the four official steps and the mission HUD", async ({
  page,
}) => {
  await enterTutorial(page);
  await expect(backdrop(page).locator("video")).toHaveAttribute(
    "src",
    BATCOMPUTER_VIDEO,
  );
  await expect(page.locator("nav [role=timer]")).toHaveText("03.00");
  await expect(page.getByRole("progressbar")).toHaveAttribute(
    "aria-valuenow",
    "0",
  );
  await expect(
    page.getByRole("heading", { name: "Tre minuti" }),
  ).toBeVisible();
  const previous = page.getByRole("button", { name: "Istruzione precedente" });
  const next = page.getByRole("button", { name: "Istruzione successiva" });
  const startMission = page.getByRole("button", { name: "Inizia la missione" });
  await expect(previous).toHaveCount(0);
  for (const title of [
    "Risolvi gli enigmi",
    "Trova le cinque carte",
    "Guardati intorno",
  ]) {
    await next.press("Enter");
    await expect(page.getByRole("heading", { name: title })).toBeVisible();
    await expect(previous).toBeVisible();
  }
  await expect(next).toHaveCount(0);
  await expect(startMission).toBeFocused();
  for (const title of [
    "Trova le cinque carte",
    "Risolvi gli enigmi",
    "Tre minuti",
  ]) {
    await previous.press("Enter");
    await expect(page.getByRole("heading", { name: title })).toBeVisible();
  }
  await expect(previous).toHaveCount(0);
  await expect(next).toBeFocused();
});
test("keyboard mission inspects cards, supports wrong answers and escape, then wins", async ({
  page,
}) => {
  test.setTimeout(240000);
  await start(page);
  await expect(backdrop(page)).toHaveCount(0);
  await reach(page, 1);
  await expect(page.getByRole("dialog", { name: "Enigma 1" })).toBeVisible();
  await page.getByRole("button", { name: "JOKER", exact: true }).click();
  await expect(
    page.getByText("RISPOSTA ERRATA", { exact: true }),
  ).toBeVisible();
  await page.keyboard.down("Escape");
  await expect(page.locator('[data-clue-id="1"]')).toHaveAttribute(
    "data-face",
    "front",
  );
  const pause = page.getByRole("heading", { name: "MISSIONE IN PAUSA" });
  await page.keyboard.down("Escape");
  await expect(pause).toHaveCount(0);
  await page.keyboard.up("Escape");
  await expect(
    page.getByRole("button", { name: "Apri indizio 1", exact: true }),
  ).toBeFocused();
  await page.keyboard.down("Escape");
  await expect(pause).toBeVisible();
  await page.keyboard.down("Escape");
  await expect(pause).toBeVisible();
  await page.keyboard.up("Escape");
  await page.keyboard.press("Escape");
  await expect(pause).toHaveCount(0);
  for (let id = 1; id <= 5; id++) await answer(page, id, responses[id - 1]);
  await expect(
    page.getByRole("heading", { name: "MISSIONE COMPIUTA" }),
  ).toBeVisible();
  await expect(
    page.locator("nav [role=timer],nav [role=progressbar]"),
  ).toHaveCount(0);
  await expect(page.locator("main [role=timer]")).not.toHaveText("00.00");
  await expect(backdrop(page)).toHaveCSS(
    "background-image",
    /BatCaverna_BatcomputerPerspective\.jpg/,
  );
  await expect(backdrop(page).locator("video")).toHaveCount(0);
  await expect(
    page.getByText(/SPEEDRUN|Premio demo|Bonus esplorazione/),
  ).toHaveCount(0);
  await page.screenshot({ path: test.info().outputPath("win.png") });
  await page.getByRole("button", { name: "Scopri la statua" }).click();
  await expect(
    page.getByRole("heading", { name: "La veglia di Gotham" }),
  ).toBeVisible();
  await expect(backdrop(page)).toHaveCount(0);
  await page
    .locator("nav")
    .getByRole("button", { name: "Preordina la statua" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Dati personali" }),
  ).toBeVisible();
});
test("correct feedback survives pause and early clues retain the hidden time bonus", async ({
  page,
}) => {
  test.setTimeout(180000);
  await page.clock.install();
  await start(page);
  await reach(page, 1);
  await page.clock.pauseAt(await page.evaluate(() => Date.now() + 1000));
  await page.getByRole("button", { name: responses[0], exact: true }).click();
  await expect(
    page.getByText("RISPOSTA CORRETTA", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Metti in pausa esperienza" }).click();
  await page.clock.runFor(1100);
  const pausedClue = page.locator(".ds-inspection");
  await expect(pausedClue).toHaveAttribute("data-stage", "confirming");
  await expect(pausedClue.getByText("RISPOSTA CORRETTA")).toBeVisible();
  await expect(pausedClue.getByRole("button")).toHaveCount(0);
  await expect(page.locator("nav [role=progressbar]")).toHaveAttribute(
    "aria-valuenow",
    "0",
  );
  await page.getByRole("button", { name: "Riprendi esperienza" }).click();
  await page.clock.runFor(1000);
  await expect(page.locator("nav [role=progressbar]")).toHaveAttribute(
    "aria-valuenow",
    "1",
  );
  await page.clock.resume();
  await answer(page, 2, responses[1]);
  await expect(
    page.getByRole("button", { name: "Raggiungi indizio 3", exact: true }),
  ).toBeEnabled({ timeout: 45000 });
  const timer = await page.locator("nav [role=timer]").innerText();
  const [minutes, seconds] = timer.split(".").map(Number);
  expect(minutes * 60 + seconds).toBeGreaterThan(180);
  await expect(page.getByText(/Bonus esplorazione|SPEEDRUN/)).toHaveCount(0);
});
test("mouse mission discovers hidden cards and collects them through the HUD", async ({
  page,
}) => {
  test.setTimeout(180000);
  await start(page, false);
  const progress = page.getByRole("progressbar", { name: "Indizi raccolti" });
  const counts = await progress.evaluateHandle((node) => {
    const values: (string | null)[] = [];
    // The fifth value is visible only until the victory screen replaces the HUD.
    new MutationObserver(() => values.push(node.getAttribute("aria-valuenow")))
      .observe(node, { attributeFilter: ["aria-valuenow"] });
    return values;
  });
  for (let id = 1; id <= 5; id++) {
    const front = page.getByRole("button", {
      name: `Apri indizio ${id}`,
      exact: true,
    });
    const marker = page.locator(`.ds-clue-marker[data-clue-id="${id}"]`);
    await expect(
      page.getByRole("button", {
        name: "Raggiungi indizio " + id,
        exact: true,
      }),
    ).toBeEnabled({ timeout: 45000 });
    if (id === 1 || id === 3 || id === 4) await expect(marker).toBeHidden();
    const viewport = page.viewportSize()!;
    let point: { x: number; y: number } | null = null;
    for (let scan = 0; scan < 180 && !point; scan++) {
      point = await marker.evaluate((el) => {
        const r = el.getBoundingClientRect(),
          x = r.x + r.width / 2,
          y = r.y + r.height / 2;
        const nav = document.querySelector("nav")!.getBoundingClientRect();
        return x > 30 &&
          x < innerWidth - 30 &&
          y > nav.bottom + 20 &&
          y < innerHeight - 20 &&
          el.contains(document.elementFromPoint(x, y))
          ? { x, y }
          : null;
      });
      if (!point) {
        await page.mouse.move(viewport.width - 5, viewport.height / 2);
        await page.waitForTimeout(100);
      }
    }
    expect(point, "carta " + id + " visibile nel panorama").not.toBeNull();
    await expect(async () => {
      const rect = await front.boundingBox();
      expect(rect).not.toBeNull();
      await page.mouse.move(
        rect!.x + rect!.width / 2,
        rect!.y + rect!.height / 2,
      );
      expect(await front.evaluate((el) => el.matches(":hover"))).toBe(true);
      // The stop event can precede one already queued panorama projection.
      // Measure the hold after that frame has reached the DOM.
      await page.evaluate(
        () =>
          new Promise<void>((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
          ),
      );
      const held = await front.boundingBox();
      await page.waitForTimeout(150);
      const next = await front.boundingBox();
      expect(Math.abs(next!.x - held!.x)).toBeLessThan(1);
      expect(Math.abs(next!.y - held!.y)).toBeLessThan(1);
    }).toPass({ timeout: 45000, intervals: [100, 150, 200] });
    if (id === 1)
      await page.screenshot({
        path: test.info().outputPath("mouse-card-front.png"),
      });
    const rect = await front.boundingBox();
    expect(rect!.width).toBeCloseTo(80, 1);
    await page.mouse.click(
      rect!.x + rect!.width / 2,
      rect!.y + rect!.height / 2,
    );
    await expect(page.locator('[data-clue-id="' + id + '"]')).toHaveAttribute(
      "data-face",
      "back",
    );
    await expect(
      page.locator('[data-clue-id="' + id + '"] .ds-clue-front'),
    ).toBeHidden();
    await expect(
      page.locator('[data-clue-id="' + id + '"] .ds-clue-back'),
    ).toBeVisible();
    if (id === 1)
      await page.screenshot({
        path: test.info().outputPath("mouse-card-back.png"),
      });
    const dialog = page.getByRole("dialog", { name: `Enigma ${id}` });
    const after = await dialog.boundingBox();
    expect(after!.width).toBeGreaterThan(rect!.width * 3);
    expect(
      Math.abs(after!.x + after!.width / 2 - viewport.width / 2),
    ).toBeLessThan(2);
    expect(
      Math.abs(after!.y + after!.height / 2 - viewport.height / 2),
    ).toBeLessThan(2);
    if (id === 1) {
      await page.mouse.click(viewport.width / 2 + 210, viewport.height / 2);
      await expect(dialog).toBeHidden();
      await expect(front).toBeFocused();
      await front.click();
    }
    await page
      .getByRole("button", { name: responses[id - 1], exact: true })
      .click();
    await expect(dialog).toBeHidden();
    if (id === 2 || id === 3) {
      await expect(
        page.getByText("TRANSIZIONE ALLA PROSSIMA AREA", { exact: true }),
      ).toHaveCount(0);
      await page.getByRole("button", { name: "Vai alla prossima area" }).click();
    }
  }
  await expect(
    page.getByRole("heading", { name: "MISSIONE COMPIUTA" }),
  ).toBeVisible();
  expect(await counts.jsonValue()).toEqual(["1", "2", "3", "4", "5"]);
  await counts.dispose();
});
test("checkout shows Bruce Wayne’s read-only details and the transport-inclusive total", async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1060 });
  await page.goto("/#checkout");
  await expect(page.getByText(/simulazion|dimostrativ/i)).toHaveCount(0);
  await expect(backdrop(page).locator("video")).toHaveAttribute("src", BATCOMPUTER_VIDEO);
  const next = page.getByRole("button", { name: "Tappa successiva" });
  const back = page.getByRole("button", { name: "Tappa precedente" });
  const readOnlyFields = page.locator("input[readonly]");
  await expect(readOnlyFields).toHaveCount(5);
  await expect(page.locator("[name=fullName]")).toHaveValue("Bruce Wayne");
  const email = page.locator("[name=email]");
  await expect(email).not.toBeEditable();
  const addressEmail = "bruce.wayne@example.com";
  await expect(email).toHaveValue(addressEmail);
  await expect(page.getByRole("textbox", { name: "Password" })).toHaveValue(
    "••••••••",
  );
  await next.click();
  await expect(page.getByRole("heading", { name: "Dati di spedizione" })).toBeFocused();
  await expect(readOnlyFields).toHaveCount(5);
  await expect(page.getByRole("textbox", { name: "Indirizzo" })).toHaveValue(
    "Villa Wayne, 1",
  );
  await back.click();
  await expect(email).toHaveValue(addressEmail);
  await next.click();
  await next.click();

  const card = page.getByRole("radio", { name: "Carta di credito o debito" });
  const paypal = page.getByRole("radio", { name: "PayPal", exact: true });
  await expect(paypal).toBeChecked();
  await expect(readOnlyFields).toHaveCount(0);
  await paypal.focus();
  await page.keyboard.press("ArrowRight");
  await expect(card).toBeChecked();
  await expect(card).toBeFocused();
  await expect(readOnlyFields).toHaveCount(4);
  await expect(page.getByRole("textbox", { name: "Numero carta" })).toHaveValue(
    "•••• •••• •••• 4242",
  );
  const cardFields = page.locator(".ds-card-fields");
  await expect(cardFields).toHaveCSS("grid-template-columns", "351.5px 351.5px");
  await expect(next).toBeInViewport();
  await page.setViewportSize({ width: 520, height: 740 });
  await expect(cardFields).toHaveCSS("grid-template-columns", /^\d+(?:[.]\d+)?px$/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(520);
  await page.keyboard.press("ArrowLeft");
  await expect(paypal).toBeChecked();
  await expect(page.locator("[name=cardNumber]")).toHaveCount(0);
  await next.click();
  await expect(page.getByText("La veglia di Gotham", { exact: true })).toBeVisible();
  await expect(page.locator(".ds-order-summary").getByText("Incluso", { exact: true })).toBeVisible();
  await expect(
    page.locator(".ds-order-summary").getByText("12.900 €", { exact: true }),
  ).toHaveCount(2);
});
for (const interaction of ["mouse", "keyboard"]) {
  test(`pre-filled checkout reaches the local confirmation by ${interaction}`, async ({
    page,
  }) => {
    const requests = observeCheckoutRequests(page);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/#checkout");
    const next = page.getByRole("button", { name: "Tappa successiva" });
    const back = page.getByRole("button", { name: "Tappa precedente" });
    const confirm = page.getByRole("button", { name: "Conferma il preordine", exact: true });
    const heading = (name: string) =>
      page.getByRole("heading", { name, exact: true });
    const advance = async (key = "ArrowRight") => {
      if (interaction === "mouse") await next.click();
      else await page.keyboard.press(key);
    };
    await expect(heading("Dati personali")).toBeFocused();
    await advance("Space");
    await expect(heading("Dati di spedizione")).toBeFocused();
    if (interaction === "mouse") await back.click();
    else await page.keyboard.press("ArrowLeft");
    await expect(heading("Dati personali")).toBeFocused();
    await advance();
    await advance();
    await expect(heading("Metodo di pagamento")).toBeFocused();
    await advance("Space");
    await expect(heading("Riepilogo")).toBeFocused();
    await expect(page.getByText("12.900 €", { exact: true }).last()).toBeVisible();
    if (interaction === "mouse") await confirm.click();
    else await page.keyboard.press("Space");
    await expect(confirm).toBeDisabled();
    await expect(heading("Preordine confermato")).toBeVisible();
    await expect(page).toHaveURL(/#conferma$/);
    await expect(page.locator("main")).toBeFocused();
    await expectLocalCheckout(page, requests);
  });
}
test("valid PayPal demo creates only a local guarded confirmation", async ({
  page,
}) => {
  const requests = observeCheckoutRequests(page);
  await page.goto("/#checkout");
  await reachOrderSummary(page);
  await page.getByRole("button", { name: "Conferma il preordine", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Preordine confermato" }),
  ).toBeVisible();
  await expect(page.getByText("La veglia di Gotham", { exact: true })).toBeVisible();
  await expect(page.getByText("12.900 €", { exact: true })).toBeVisible();
  await expect(page.getByText("ord-bw-4019", { exact: true })).toBeVisible();
  await expect(page.getByText("Da concordare", { exact: true })).toBeVisible();
  await expect(backdrop(page).locator("video")).toHaveAttribute(
    "src",
    BATCOMPUTER_VIDEO,
  );
  await expectLocalCheckout(page, requests);
  await page.reload();
  await expect(page).toHaveURL(/#statua$/);
});
test("card demo prevents duplicate submissions and never sends form data", async ({
  page,
}) => {
  const requests = observeCheckoutRequests(page);
  await page.goto("/#checkout");
  await reachOrderSummary(page, true);
  const history = await page.evaluate(() => window.history.length);
  await page.getByRole("button", { name: "Conferma il preordine", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Conferma il preordine", exact: true }),
  ).toBeDisabled();
  await page.locator("form").evaluate((el) => {
    (el as HTMLFormElement).requestSubmit();
    (el as HTMLFormElement).requestSubmit();
  });
  await expect(
    page.getByRole("heading", { name: "Preordine confermato" }),
  ).toBeVisible();
  expect(await page.evaluate(() => window.history.length)).toBe(history + 1);
  await expectLocalCheckout(page, requests);
  await page.getByRole("button", { name: "Torna alla home" }).click();
  await expect(
    page.getByRole("heading", { name: "La Veglia di Gotham" }),
  ).toBeVisible();
});
test("leaving checkout during processing cancels late confirmation", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#statua");
  await page
    .locator("nav")
    .getByRole("button", { name: "Preordina la statua" })
    .click();
  await reachOrderSummary(page);
  await page.getByRole("button", { name: "Conferma il preordine", exact: true }).click();
  await page.goBack();
  await page.waitForTimeout(4500);
  await expect(page).toHaveURL(/#statua$/);
  await expect(
    page.getByRole("heading", { name: "Preordine confermato" }),
  ).toHaveCount(0);
});
test("phones and touch tablets load only the static perspective background", async ({
  browser,
}) => {
  for (const device of [
    {
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)",
      viewport: { width: 390, height: 844 },
    },
    {
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)",
      viewport: { width: 844, height: 390 },
    },
    {
      userAgent: "Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X)",
      viewport: { width: 1024, height: 1366 },
    },
    {
      userAgent: "Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X)",
      viewport: { width: 1366, height: 1024 },
    },
  ]) {
    const context = await browser.newContext({ ...device, hasTouch: true });
    const page = await context.newPage();
    const media = new Set<string>();
    page.on("request", (r) => {
      if (/assets\/(audio|videos|textures|showreel|ds\/card)/.test(r.url()))
        media.add(new URL(r.url()).pathname);
    });
    await page.goto(
      (process.env.BASE_URL || "http://127.0.0.1:4173") + "/#checkout",
    );
    await expect(
      page.getByRole("heading", { name: "Apri il sito da computer" }),
    ).toBeVisible();
    await expect(page.locator("button,nav,canvas,audio,video")).toHaveCount(0);
    await expect(page.locator(".ds-logos img")).toHaveCount(3);
    await expect(backdrop(page)).toHaveCSS(
      "background-image",
      /BatCaverna_BatcomputerPerspective\.jpg/,
    );
    expect([...media]).toEqual([BATCOMPUTER_PERSPECTIVE]);
    await context.close();
  }
});
test("showreel paints without scrolling, bounds requests and recovers after missing frames", async ({
  page,
}) => {
  let inFlight = 0,
    max = 0;
  await page.route("**/assets/showreel/*.webp", async (route) => {
    inFlight++;
    max = Math.max(max, inFlight);
    await new Promise((r) => setTimeout(r, 60));
    if (route.request().url().endsWith("/0001.webp")) await route.abort();
    else await route.continue();
    inFlight--;
  });
  await page.goto("/#statua");
  await expect(page.locator("canvas")).toBeVisible();
  await expect
    .poll(() =>
      page.locator("canvas").evaluate((el) => {
        const c = el as HTMLCanvasElement;
        return (
          c.getContext("2d")!.getImageData(c.width / 2, c.height / 2, 1, 1)
            .data[3] > 0
        );
      }),
    )
    .toBe(true);
  expect(max).toBeLessThanOrEqual(6);
  await expect(
    page.getByRole("button", { name: "Metti in pausa esperienza" }),
  ).toHaveCount(0);
  const scrollToProgress = (progress: number) =>
    page.evaluate(
      (p) => window.scrollTo(0, (document.documentElement.scrollHeight - innerHeight) * p),
      progress,
    );
  const overlays = page.locator(".ds-showreel-overlay:visible");
  const canvas = page.locator(".statue-stage canvas");
  const firstCard = page.locator(".ds-showreel-overlay").filter({
    hasText: "Bronzo a cera persa",
  });
  const finalButton = page.locator("main").getByRole("button", {
    name: "Preordina la statua",
  });
  const contentViewport = () =>
    page.evaluate(() => ({
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
    }));
  const expectVideoToFillViewport = async () => {
    const { width, height } = await contentViewport();
    await expect
      .poll(() => canvas.boundingBox())
      .toEqual({ x: 0, y: 0, width, height });
  };

  await expect(overlays).toHaveCount(0);
  await expectVideoToFillViewport();
  await scrollToProgress(0.05);
  const firstOpacity = () => firstCard.evaluate((el) => Number(getComputedStyle(el).opacity));
  await expect.poll(firstOpacity).toBeCloseTo(0.5, 1);
  await scrollToProgress(0.12);
  await expect(firstCard).toHaveCSS("opacity", "1");
  await expect(page.getByRole("heading", { name: "Bronzo a cera persa" })).toBeVisible();
  await expect(page.locator(".ds-showreel-right:visible .ds-showreel-card")).toHaveCount(1);
  await scrollToProgress(0.265);
  await expect.poll(firstOpacity).toBeCloseTo(0.5, 1);
  await scrollToProgress(0.31);
  await expect(overlays).toHaveCount(0);
  await scrollToProgress(0.265);
  await expect.poll(firstOpacity).toBeCloseTo(0.5, 1);
  await scrollToProgress(0.12);
  await expect(firstCard).toHaveCSS("opacity", "1");

  await scrollToProgress(0.4);
  await expect(page.getByRole("heading", { name: "La posa sul gargoyle" })).toBeVisible();
  await expect(page.locator(".ds-showreel-left:visible .ds-showreel-card")).toHaveCount(1);
  await expectVideoToFillViewport();

  await page.setViewportSize({ width: 680, height: 760 });
  await scrollToProgress(0.62);
  await expect(overlays).toHaveCount(0);
  await scrollToProgress(0.72);
  await expect(page.getByRole("heading", { name: "Patina bruna" })).toBeVisible();
  await expectVideoToFillViewport();
  const narrowCard = await page
    .locator(".ds-showreel-overlay:visible .ds-showreel-card")
    .boundingBox();
  const narrowViewport = await contentViewport();
  expect(narrowCard!.x + narrowCard!.width / 2).toBeCloseTo(
    narrowViewport.width / 2,
    0,
  );
  expect(narrowCard!.y).toBeGreaterThan(narrowViewport.height / 2);

  await scrollToProgress(0.91);
  await expect(overlays).toHaveCount(0);
  await scrollToProgress(0.95);
  await expect(finalButton).toBeVisible();
  await expect(finalButton).toBeDisabled();
  await scrollToProgress(0.12);
  await expect(firstCard).toHaveCSS("opacity", "1");
  await scrollToProgress(1);
  await expect(finalButton).toBeEnabled();
  await expect(page.getByRole("heading", { name: "La veglia di Gotham" })).toBeInViewport();
  await expect(page.getByText("Statua di Batman in bronzo, scala 1:1")).toBeInViewport();
  await expect(page.getByText("180 × 130 × 135 cm circa (A × L × P), base inclusa")).toBeInViewport();
  await expectVideoToFillViewport();
  await expect(page.locator("footer,.gallery-options")).toHaveCount(0);
  await finalButton.focus();
  await expect(finalButton).toBeFocused();
  await finalButton.press("Enter");
  await expect(page).toHaveURL(/#checkout$/);
  await expect(
    page.getByRole("heading", { name: "Dati personali", exact: true }),
  ).toBeFocused();
});
test("complete image failure keeps recoverable provisional state", async ({
  page,
}) => {
  await page.route("**/assets/showreel/*.webp", (r) => r.abort());
  await page.goto("/#statua");
  await expect(page.getByText(/Il browser non riesce a caricare le immagini della statua/)).toBeVisible();
  await page.unroute("**/assets/showreel/*.webp");
  await page.getByRole("button", { name: "Riprova", exact: true }).click();
  await expect(page.locator(".statue-loading")).toHaveCount(0);
});
test("WebGL denial freezes mission time and offers the existing recovery path", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const get = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      type: string,
      ...args: unknown[]
    ) {
      if (/webgl/.test(type)) return null;
      return get.apply(this, [type, ...args] as Parameters<typeof get>);
    } as typeof get;
  });
  await enterTutorial(page);
  await expect(backdrop(page)).toHaveCSS(
    "background-image",
    /BatCaverna_BatcomputerPerspective\.jpg/,
  );
  await expect(backdrop(page).locator("canvas")).toBeHidden();
  await beginMission(page);
  await expect(
    page.getByRole("heading", { name: "La Batcaverna non si apre" }),
  ).toBeVisible();
  await expect(page.locator("nav [role=timer]")).toHaveText("03.00");
  await page.waitForTimeout(1200);
  await expect(page.locator("nav [role=timer]")).toHaveText("03.00");
  await page
    .getByRole("button", { name: "Scopri la statua", exact: true })
    .click();
  await expect(page).toHaveURL(/#statua$/);
});
test("failed videos fall back to images and transitions can continue", async ({
  page,
}) => {
  test.setTimeout(180000);
  await page.route("**/*.mp4", (r) => r.abort());
  await start(page, false);
  for (let id = 1; id <= 5; id++) {
    await answer(page, id, responses[id - 1]);
    if (id === 2 || id === 3)
      await page
        .getByRole("button", { name: "Vai alla prossima area" })
        .click();
  }
  await expect(
    page.getByRole("heading", { name: "MISSIONE COMPIUTA" }),
  ).toBeVisible();
});
test("a video that stalls after decoding still opens the mission on the static panorama", async ({
  page,
}) => {
  await page.clock.install();
  await page.addInitScript(() => {
    const media = HTMLMediaElement.prototype;
    const play = media.play;
    const readyState = Object.getOwnPropertyDescriptor(media, "readyState")!;
    const stalls = (element: HTMLMediaElement) =>
      !element.isConnected &&
      element.src.endsWith("BatCaverna_Batcomputer360.mp4");
    Object.defineProperty(media, "readyState", {
      ...readyState,
      get(this: HTMLMediaElement) {
        return stalls(this)
          ? HTMLMediaElement.HAVE_CURRENT_DATA
          : readyState.get!.call(this);
      },
    });
    media.play = function (this: HTMLMediaElement) {
      return stalls(this) ? new Promise<void>(() => {}) : play.call(this);
    };
  });
  await enterTutorial(page);
  await beginMission(page);
  const firstClue = page.getByRole("button", {
    name: "Raggiungi indizio 1",
    exact: true,
  });
  await expect(firstClue).toBeEnabled({ timeout: 5000 });
  await page.clock.fastForward(8200);
  await expect(firstClue).toBeEnabled();
});
test("hint, pause and failure use active mission time without added badges", async ({
  page,
}) => {
  await page.clock.install();
  await start(page);
  await page.clock.fastForward(61000);
  await expect(page.locator(".ds-clue-hint")).toHaveCount(1);
  await page.getByRole("button", { name: "Metti in pausa esperienza" }).click();
  await expect(backdrop(page)).toHaveCount(0);
  await expect(page.locator(".panorama-scene canvas")).toBeVisible();
  const overlay = page.locator(".ds-pause");
  expect(await overlay.boundingBox()).toEqual({
    x: 0,
    y: 0,
    ...page.viewportSize(),
  });
  const expectedColor = await overlay.evaluate((el) => {
    const swatch = document.createElement("div");
    swatch.style.backgroundColor = "color-mix(in srgb, #010013 40%, transparent)";
    el.append(swatch);
    const color = getComputedStyle(swatch).backgroundColor;
    swatch.remove();
    return color;
  });
  await expect(overlay).toHaveCSS("background-color", expectedColor);
  const pauseTitle = page.getByRole("heading", { name: "MISSIONE IN PAUSA" });
  expect(
    await pauseTitle.evaluate((title) => {
      const { x, y, width, height } = title.getBoundingClientRect();
      const top = document.elementFromPoint(x + width / 2, y + height / 2);
      return Boolean(top?.closest(".ds-pause"));
    }),
  ).toBe(true);
  const time = await page.locator("nav [role=timer]").innerText();
  await page.clock.fastForward(70000);
  await expect(page.locator("nav [role=timer]")).toHaveText(time);
  await page.getByRole("button", { name: "Riprendi esperienza" }).click();
  await page.clock.fastForward(125000);
  await expect(
    page.getByRole("heading", { name: "MISSIONE FALLITA" }),
  ).toBeVisible();
  await expect(backdrop(page)).toHaveCSS(
    "background-image",
    /BatCaverna_BatcomputerPerspective\.jpg/,
  );
  await expect(
    page.locator("nav [role=timer],nav [role=progressbar]"),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Riprova la missione" }).click();
  await expect(
    page.getByRole("heading", { name: "La Veglia di Gotham" }),
  ).toBeVisible();
});
test("short desktop and zoom equivalent allow tutorial, in-world answers, checkout and static showreel", async ({
  page,
}) => {
  await page.setViewportSize({ width: 720, height: 450 });
  await start(page);
  await answer(page, 1, responses[0]);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.goto("/#checkout");
  await reachOrderSummary(page);
  await page.getByRole("button", { name: "Conferma il preordine", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Preordine confermato" }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.goto("/#statua");
  await expect(page.locator(".statue-loading")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "La veglia di Gotham" })).toBeInViewport();
  await expect(page.getByText("Statua di Batman in bronzo, scala 1:1")).toBeInViewport();
  await expect(page.getByText("180 × 130 × 135 cm circa (A × L × P), base inclusa")).toBeInViewport();
  await expect(page.locator("main").getByRole("button", { name: "Preordina la statua" })).toBeInViewport();
});
test("axe checks official start, tutorial, checkout, confirmation and static showreel", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const check = async () =>
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.goto("/");
  await check();
  await page.getByRole("button", { name: "Entra nella Batcaverna" }).click();
  await check();
  await page
    .getByRole("button", {
      name: "Gira la carta",
      exact: true,
    })
    .click();
  await check();
  await page
    .getByRole("button", { name: "Accetta la sfida", exact: true })
    .click();
  await check();
  await page.goto("/#checkout");
  await check();
  await reachOrderSummary(page);
  await page.getByRole("button", { name: "Conferma il preordine", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Preordine confermato" }),
  ).toBeVisible();
  await check();
  await page.goto("/#statua");
  const poster = page.getByRole("img", {
    name: "Batman accovacciato sul gargoyle",
  });
  await expect(poster).toBeVisible();
  await expect(page.locator(".statue-stage canvas")).toHaveCount(0);
  await expect(page.locator(".statue-stage").getByRole("listitem")).toHaveText([
    /Bronzo a cera persa/,
    /La posa sul gargoyle/,
    /Patina bruna/,
  ]);
  await expect(page.getByRole("heading", { name: "La veglia di Gotham" })).toBeInViewport();
  await expect(page.getByText("Statua di Batman in bronzo, scala 1:1")).toBeInViewport();
  await expect(page.getByText("180 × 130 × 135 cm circa (A × L × P), base inclusa")).toBeInViewport();
  await expect(
    page.locator("main").getByRole("button", { name: "Preordina la statua" }),
  ).toBeEnabled();
  await check();
});
test("unknown paths and the static error entry show the Figma 404", async ({
  page,
}) => {
  for (const path of ["/pagina-inesistente", "/404.html"]) {
    await page.goto(path);
    await expect(page.getByRole("heading", { name: "404" })).toBeVisible();
    await expect(page).toHaveTitle("404 | La Veglia di Gotham");
    await expect(backdrop(page).locator("video")).toHaveAttribute(
      "src",
      BATCOMPUTER_VIDEO,
    );
    await page.getByRole("link", { name: "Torna alla home" }).click();
    await expect(
      page.getByRole("heading", { name: "La Veglia di Gotham" }),
    ).toBeVisible();
  }
});
test("button activations play UI feedback and mute blocks click and answer sounds", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const Original = window.AudioContext;
    const contexts: AudioContext[] = [];
    Object.defineProperty(window, "__contexts", { value: contexts });
    window.AudioContext = class extends Original {
      constructor(...args: ConstructorParameters<typeof AudioContext>) {
        super(...args);
        contexts.push(this);
      }
    };
  });
  await start(page);
  await page.evaluate(() => {
    let count = 0;
    const original = AudioContext.prototype.createOscillator;
    AudioContext.prototype.createOscillator = function (...args) {
      count++;
      return original.apply(this, args);
    };
    Object.defineProperty(window, "__beeps", { get: () => count });
  });
  const oscillatorCount = () =>
    page.evaluate(() => (window as unknown as { __beeps: number }).__beeps);
  await reach(page, 1);
  expect(await oscillatorCount()).toBe(1);
  await page.getByRole("button", { name: "Silenzia audio" }).click();
  await page.getByRole("button", { name: "JOKER", exact: true }).click();
  await page.keyboard.press("Escape");
  await reach(page, 1);
  expect(await oscillatorCount()).toBe(1);
});
test("audio starts after returning to desktop from touch mode", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const matchMedia = window.matchMedia.bind(window);
    const media = "(pointer: coarse)";
    const pointer = new EventTarget() as MediaQueryList;
    let coarse = false;
    Object.defineProperties(pointer, {
      media: { value: media },
      matches: { get: () => coarse },
    });
    window.matchMedia = (query) => (query === media ? pointer : matchMedia(query));
    window.addEventListener("test:pointer-mode", (event) => {
      coarse = (event as CustomEvent<boolean>).detail;
      pointer.dispatchEvent(new Event("change"));
    });
  });
  const setCoarsePointer = (detail: boolean) =>
    page.evaluate((mode) => {
      window.dispatchEvent(new CustomEvent("test:pointer-mode", { detail: mode }));
    }, detail);

  await page.goto("/");
  await page.getByRole("button", { name: "Silenzia audio" }).click();
  await setCoarsePointer(true);
  await expect(
    page.getByRole("heading", { name: "Apri il sito da computer" }),
  ).toBeVisible();
  await setCoarsePointer(false);
  await expect(page.getByRole("button", { name: "Silenzia audio" })).toBeVisible();

  const music = page.waitForRequest("**/assets/audio/SiglaBatman.wav");
  await page.getByRole("button", { name: "Entra nella Batcaverna", exact: true }).click();
  await music;
});
