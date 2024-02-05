/**
 * Check if we're running on a mobile.
 * @returns {boolean} true if it's a mobile false if not.
 */
export function isMobile () {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

/**
 * Check if we're running on Apple mobile.
 * @returns {boolean} true if it's Apple's mobile.
 */
export function isAppleMobile () {
  return isMobile() && /iPhone|iPad|iPod/i.test(navigator.userAgent)
}

/**
 * Open the mobile native SMS app and pre-fill it.
 * @param {integer} number to send the SMS message to.
 * @param {string} message SMS body content to send.
 */
export function openNativeSms (number, message) {
  const separator = isAppleMobile() ? '&' : '?'

  window.location.href = `sms:${number}${separator}body=${message}`
}
