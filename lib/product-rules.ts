export function canSendPreMatchIntroduction(hasActiveSubscription: boolean) {
  return hasActiveSubscription;
}

export function addBoostCredits(currentCredits: number, purchasedCredits: number) {
  if (!Number.isInteger(currentCredits) || currentCredits < 0) {
    throw new RangeError("Current Boost credits must be a non-negative integer.");
  }
  if (!Number.isInteger(purchasedCredits) || purchasedCredits <= 0) {
    throw new RangeError("Purchased Boost credits must be a positive integer.");
  }
  return currentCredits + purchasedCredits;
}

export function consumeBoostCredit(currentCredits: number) {
  if (!Number.isInteger(currentCredits) || currentCredits <= 0) {
    return { started: false, remainingCredits: Math.max(0, currentCredits) };
  }
  return { started: true, remainingCredits: currentCredits - 1 };
}
