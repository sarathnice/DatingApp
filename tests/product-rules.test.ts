import { describe, expect, it } from "vitest";
import {
  addBoostCredits,
  canSendPreMatchIntroduction,
  consumeBoostCredit,
} from "../lib/product-rules";

describe("Mila product rules", () => {
  it("requires an active subscription for a pre-match introduction", () => {
    expect(canSendPreMatchIntroduction(false)).toBe(false);
    expect(canSendPreMatchIntroduction(true)).toBe(true);
  });

  it("adds and consumes Boost credits without going negative", () => {
    expect(addBoostCredits(1, 5)).toBe(6);
    expect(consumeBoostCredit(2)).toEqual({ started: true, remainingCredits: 1 });
    expect(consumeBoostCredit(0)).toEqual({ started: false, remainingCredits: 0 });
  });
});
