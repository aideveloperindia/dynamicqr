/**
 * Merchant Resolution Module
 * Resolves the nearest merchant based on geolocation or IP fallback
 */

const geoip = require('geoip-lite');

/**
 * Calculate Haversine distance between two coordinates (in km)
 * @param {number} lat1 
 * @param {number} lon1 
 * @param {number} lat2 
 * @param {number} lon2 
 * @returns {number} Distance in kilometers
 */
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * Get IP-based geolocation (fallback)
 * @param {string} ip - IP address
 * @returns {Object|null} {lat, lng} or null
 */
function getIPGeolocation(ip) {
  try {
    // Remove port if present
    const cleanIP = ip.split(':').pop();
    const geo = geoip.lookup(cleanIP);
    
    if (geo && geo.ll) {
      return {
        lat: geo.ll[0],
        lng: geo.ll[1]
      };
    }
  } catch (error) {
    console.error('[IP Geo Error]', error);
  }
  
  return null;
}

/**
 * Resolve the nearest merchant from a list
 * @param {Array} merchants - Array of merchant objects
 * @param {Object|null} coords - {lat, lng} or null
 * @param {string} ip - IP address for fallback
 * @returns {Object} Selected merchant
 */
async function resolveMerchant(merchants, coords, ip) {
  if (merchants.length === 0) {
    throw new Error('No merchants provided');
  }

  if (merchants.length === 1) {
    return merchants[0];
  }

  // Try to get coordinates
  let location = coords;
  
  if (!location) {
    location = getIPGeolocation(ip);
  }

  // If we have location, find nearest merchant
  if (location && !isNaN(location.lat) && !isNaN(location.lng)) {
    let nearest = merchants[0];
    let minDistance = Infinity;

    for (const merchant of merchants) {
      if (merchant.location && merchant.location.lat && merchant.location.lng) {
        const distance = haversineDistance(
          location.lat,
          location.lng,
          merchant.location.lat,
          merchant.location.lng
        );

        if (distance < minDistance) {
          minDistance = distance;
          nearest = merchant;
        }
      }
    }

    console.log(`[GEO] Nearest merchant: ${nearest.name} (${minDistance.toFixed(2)} km away)`);
    return nearest;
  }

  // Fallback: return first merchant
  console.log('[GEO] No location available, using first merchant');
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
  getMerchantsByCode,
  haversineDistance,
  getIPGeolocation
};

