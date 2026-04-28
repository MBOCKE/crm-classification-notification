/**
 * Format date to YYYY-MM-DD
 */
function formatDate(date = new Date()) {
  return date.toISOString().split('T')[0];
}

/**
 * Calculate days between two dates
 */
function daysBetween(date1, date2) {
  const diff = Math.abs(new Date(date1) - new Date(date2));
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

/**
 * Safely parse JSON with fallback
 */
function safeJsonParse(str, fallback = null) {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

/**
 * Validate email format
 */
function isValidEmail(email) {
  const re = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
  return re.test(email);
}

/**
 * Sanitize object – remove null/undefined values
 */
function sanitizeObject(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v != null)
  );
}

/**
 * Pagination helper
 */
function getPagination(limit, offset, total) {
  return {
    limit: parseInt(limit) || 50,
    offset: parseInt(offset) || 0,
    total,
    hasMore: (offset + limit) < total
  };
}

module.exports = {
  formatDate,
  daysBetween,
  safeJsonParse,
  isValidEmail,
  sanitizeObject,
  getPagination
};