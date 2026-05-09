/**
 * Calculate stars earned for a purchase.
 *
 * Stars are FIXED per product (sourced from Star.xlsx columns I & J).
 * Formula: totalStars = starRatePerUnit × quantity
 *
 * @param {object} product    productMaster entry
 * @param {number} quantity   number of purchase units
 * @param {'AMB'|'TMW'} memberType
 */
export function calculateStars(product, quantity, memberType) {
  const ratePerUnit = memberType === 'AMB' ? product.ambStars : product.tmwStars
  const starsEarned = ratePerUnit * quantity
  const totalPrice = product.pricePerPiece * quantity

  return {
    starsEarned,
    ratePerUnit,
    totalPrice,
    hasPromotion: Boolean(product.promotion),
  }
}

/**
 * Sum all stars from a diary array.
 */
export function accumulatedStars(diary) {
  return diary.reduce((sum, entry) => sum + (entry.starsEarned || 0), 0)
}
