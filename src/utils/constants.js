// Tier definitions (mirror ruleEngine DEFAULT_TIERS, but accessible globally)
const TIERS = {
  PREMIUM: { name: 'PREMIUM', minScore: 85, color: '#FFD700' },
  STANDARD: { name: 'STANDARD', minScore: 60, color: '#C0C0C0' },
  NORMAL: { name: 'NORMAL', minScore: 30, color: '#CD7F32' },
  BRONZE: { name: 'BRONZE', minScore: 10, color: '#8B4513' },
  NEW: { name: 'NEW', minScore: 0, color: '#808080' }
};

// Notification types
const NOTIFICATION_TYPES = {
  TIER_CHANGE: 'TIER_CHANGE',
  INACTIVITY: 'INACTIVITY',
  BONUS: 'BONUS',
  WELCOME: 'WELCOME',
  CUSTOM: 'CUSTOM'
};

// Trigger events for classification
const TRIGGER_EVENTS = {
  PURCHASE: 'purchase',
  ADMIN: 'admin',
  SYSTEM: 'system',
  BONUS: 'bonus'
};

// Error messages
const ERROR_MESSAGES = {
  CUSTOMER_NOT_FOUND: 'Customer not found',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Insufficient permissions',
  INVALID_TOKEN: 'Invalid or expired token',
  RULE_NOT_FOUND: 'Classification rule not found',
  DATABASE_ERROR: 'Database operation failed'
};

// HTTP status codes (optional)
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
};

module.exports = {
  TIERS,
  NOTIFICATION_TYPES,
  TRIGGER_EVENTS,
  ERROR_MESSAGES,
  HTTP_STATUS
};