/**
 * Stars per product come from ดาว AMB / ดาว TMW columns (Star Patinum.xlsx).
 * Savings = ราคาปกติ − ราคาหลังหักดาว AMB / TRUE
 */
export function calculateStars(product, quantity, memberType) {
  const ratePerUnit = memberType === 'AMB' ? product.ambStars : product.tmwStars
  const starsEarned = ratePerUnit * quantity
  const totalPrice = product.pricePerPiece * quantity

  const savingsAMB =
    product.priceAfterAMB != null
      ? +(product.pricePerPiece - product.priceAfterAMB).toFixed(2)
      : null

  const savingsTMW =
    product.priceAfterTMW != null
      ? +(product.pricePerPiece - product.priceAfterTMW).toFixed(2)
      : null

  return {
    starsEarned,
    ratePerUnit,
    totalPrice,
    savingsAMB,
    savingsTMW,
    hasPromotion: Boolean(product.promotion),
  }
}

export function accumulatedStars(diary) {
  return diary.reduce((sum, entry) => sum + (entry.starsEarned || 0), 0)
}
