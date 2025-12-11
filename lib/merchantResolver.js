/**
 * Merchant Resolution Module
 * Simply returns the first merchant (no geolocation)
 */

/**
 * Resolve merchant from a list (always returns first merchant)
 * @param {Array} merchants - Array of merchant objects
 * @returns {Object} Selected merchant
 */
function resolveMerchant(merchants) {
  if (merchants.length === 0) {
    throw new Error('No merchants provided');
  }

  // Always return first merchant - no geolocation needed
  console.log(`[MERCHANT] Using first merchant: ${merchants[0].name}`);
  return merchants[0];
}

/**
 * Get all merchants for a given code
 * @param {string} code - Short code
 * @returns {Array} Array of merchants
 */
function getMerchantsByCode(code) {
  // Clear cache to get fresh data
  delete require.cache[require.resolve('../data/merchants.json')];
  const merchants = require('../data/merchants.json');
  return merchants.filter(m => m.codes && m.codes.includes(code));
}

module.exports = {
  resolveMerchant,
  getMerchantsByCode
};

