/**
 * App Detection Module
 * Detects which app opened the QR code based on User-Agent and X-Requested-With headers
 */

const AppType = {
  GOOGLE_PAY: 'google_pay',
  PHONEPE: 'phonepe',
  PAYTM: 'paytm',
  GOOGLE_LENS: 'google_lens',
  CAMERA: 'camera',
  BROWSER: 'browser',
  UNKNOWN: 'unknown'
};

// Detection rules: package names and UA patterns
const DETECTION_RULES = {
  [AppType.GOOGLE_PAY]: {
    xRequestedWith: ['com.google.android.apps.nbu.paisa.user'],
    userAgent: ['GPay', 'Google Pay', 'paisa']
  },
  [AppType.PHONEPE]: {
    xRequestedWith: ['com.phonepe.app'],
    userAgent: ['PhonePe']
  },
  [AppType.PAYTM]: {
    xRequestedWith: ['net.one97.paytm'],
    userAgent: ['Paytm', 'PayTM']
  },
  [AppType.GOOGLE_LENS]: {
    userAgent: ['GoogleLens', 'Lens', 'Google.*Lens']
  },
  [AppType.CAMERA]: {
    userAgent: ['Camera', 'iOS.*Camera']
  }
};

/**
 * Detects which app opened the URL
 * @param {string} userAgent - HTTP User-Agent header
 * @param {string} xRequestedWith - HTTP X-Requested-With header
 * @returns {string} AppType constant
 */
function detectApp(userAgent = '', xRequestedWith = '') {
  const ua = (userAgent || '').toLowerCase();
  const xrw = (xRequestedWith || '').toLowerCase();

  // Check X-Requested-With first (most reliable)
  for (const [appType, rules] of Object.entries(DETECTION_RULES)) {
    if (rules.xRequestedWith) {
      for (const pattern of rules.xRequestedWith) {
        if (xrw.includes(pattern.toLowerCase())) {
          return appType;
        }
      }
    }
  }

  // Check User-Agent patterns (more comprehensive)
  for (const [appType, rules] of Object.entries(DETECTION_RULES)) {
    if (rules.userAgent) {
      for (const pattern of rules.userAgent) {
        const regex = new RegExp(pattern.toLowerCase(), 'i');
        if (regex.test(ua)) {
          return appType;
        }
      }
    }
  }

  // Additional detection: Check for Google Pay in User-Agent (common patterns)
  if (ua.includes('paisa') || ua.includes('gpay') || ua.includes('google pay')) {
    return AppType.GOOGLE_PAY;
  }

  // Additional detection: Check for PhonePe
  if (ua.includes('phonepe')) {
    return AppType.PHONEPE;
  }

  // Additional detection: Check for Paytm
  if (ua.includes('paytm')) {
    return AppType.PAYTM;
  }

  // Check if it's a mobile browser (might be from payment app's in-app browser)
  // If referer or other indicators suggest payment app, try to detect
  // For now, default to browser
  return AppType.BROWSER;
}

module.exports = {
  detectApp,
  AppType,
  DETECTION_RULES
};



