import { test } from "node:test";
import assert from "node:assert/strict";
import {
  experienceReducer as reduce,
  initialExperience as initial,
  phaseFromHash,
} from "../src/lib/experience";
import { formatEuro, STATUE_PRICE } from "../src/lib/statue";
const story = () => reduce(initial, { type: "storytelling" });
const mission = () =>
  reduce(reduce(story(), { type: "tutorial" }), { type: "start" });
test("start, storytelling and tutorial are distinct guarded steps", () => {
  assert.equal(initial.phase, "start");
  assert.equal(reduce(initial, { type: "start" }), initial);
  assert.equal(reduce(initial, { type: "tutorial" }), initial);
  assert.equal(story().phase, "storytelling");
  assert.equal(reduce(story(), { type: "tutorial" }).phase, "tutorial");
  assert.equal(mission().phase, "batcomputer");
});
test("confirmation requires a single statue at the displayed price", () => {
  const order = { quantity: 1, total: STATUE_PRICE };
  assert.equal(
    reduce(initial, { type: "navigate", phase: "thankyou" }).phase,
    "showreel",
  );
  assert.equal(
    reduce(initial, { type: "purchase", order }),
    initial,
  );
  const checkout = reduce(initial, { type: "navigate", phase: "checkout" });
  for (const invalid of [
    { quantity: 0, total: STATUE_PRICE },
    { quantity: 2, total: STATUE_PRICE * 2 },
    { quantity: 1, total: 750 },
    { quantity: 1, total: 0 },
    { quantity: 1, total: NaN },
  ])
    assert.equal(
      reduce(checkout, { type: "purchase", order: invalid }),
      checkout,
    );
  const confirmation = reduce(checkout, { type: "purchase", order });
  assert.equal(confirmation.phase, "thankyou");
  assert.deepEqual(confirmation.order, order);
  assert.equal(formatEuro(STATUE_PRICE), "12.900 €");
});
test("five clues across three scenes are required to win", () => {
  let s = mission();
  assert.equal(reduce(s, { type: "win", time: 40 }), s);
  s = reduce(s, { type: "progress", count: 2 });
  s = reduce(s, { type: "next" });
  assert.equal(s.phase, "transition1");
  s = reduce(s, { type: "next" });
  assert.equal(s.phase, "armeria");
  s = reduce(s, { type: "progress", count: 3 });
  s = reduce(reduce(s, { type: "next" }), { type: "next" });
  assert.equal(s.phase, "batmobile");
  s = reduce(s, { type: "progress", count: 5 });
  const win = reduce(s, { type: "win", time: 42 });
  assert.equal(win.status, "succeeded");
  assert.equal(win.phase, "reveal");
  assert.equal(win.time, 42);
  assert.equal("speedrun" in win, false);
});
test("failure cannot progress and reset starts a clean run", () => {
  let s = reduce(mission(), { type: "fail" });
  assert.equal(reduce(s, { type: "next" }), s);
  s = reduce(s, { type: "navigate", phase: "showreel" });
  assert.equal(s.status, "idle");
  assert.deepEqual(reduce(s, { type: "reset" }), {
    ...initial,
    run: s.run + 1,
  });
});
test("hash routes expose product screens without arbitrary mission skips", () => {
  assert.equal(phaseFromHash("#statua"), "showreel");
  assert.equal(phaseFromHash("#checkout"), "checkout");
  assert.equal(phaseFromHash("#armeria"), "start");
});
