/**
 * Yemeni Phone Number Validator & Formatter
 * 
 * Rules for Yemeni Mobile Numbers:
 * - 9 digits in total
 * - Starts with digit 7 (Mobile operators: 70, 71, 73, 77, 78)
 * - Supported input formats:
 *   - Local 9 digits: e.g. 777123456, 733123456, 712123456, 780123456, 700123456
 *   - Local with leading zero: e.g. 0777123456
 *   - International: +967777123456, 00967777123456, 967777123456
 * 
 * Important:
 * - Primary Phone, Secondary Phone, and WhatsApp Phone CAN be identical or different.
 * - Each must be validated against the standard Yemeni mobile format.
 */

// Strips out non-digit characters except leading plus if any
export function sanitizePhone(input: string): string {
  if (!input) return '';
  // Convert Arabic/Indic numerals to Western digits if present
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  let sanitized = input.trim();
  for (let i = 0; i < 10; i++) {
    sanitized = sanitized.replace(new RegExp(arabicDigits[i], 'g'), i.toString());
  }
  return sanitized.replace(/[^\d+]/g, '');
}

/**
 * Normalizes any Yemeni phone input to standard 9-digit format (e.g. 777123456)
 */
export function normalizeYemeniPhone(input: string): string {
  let cleaned = sanitizePhone(input);
  if (!cleaned) return '';

  // Remove leading plus or 00
  if (cleaned.startsWith('+')) {
    cleaned = cleaned.substring(1);
  } else if (cleaned.startsWith('00')) {
    cleaned = cleaned.substring(2);
  }

  // Remove country code 967 if present
  if (cleaned.startsWith('967')) {
    cleaned = cleaned.substring(3);
  }

  // Remove leading zero if entered locally (e.g. 0777123456 -> 777123456)
  if (cleaned.startsWith('0') && cleaned.length === 10) {
    cleaned = cleaned.substring(1);
  }

  return cleaned;
}

/**
 * Validates whether a phone number is a valid Yemeni mobile number
 * Mobile numbers in Yemen are 9 digits and start with 7
 */
export function isValidYemeniPhone(input: string, isOptional: boolean = false): boolean {
  if (!input || !input.trim()) {
    return isOptional;
  }
  const normalized = normalizeYemeniPhone(input);
  // Must be exactly 9 digits and start with 7
  return /^7[0-9]{8}$/.test(normalized);
}

/**
 * Formats a valid Yemeni phone for display
 * e.g. 777123456 -> +967 777 123 456
 */
export function formatYemeniPhone(input: string): string {
  const normalized = normalizeYemeniPhone(input);
  if (!normalized || normalized.length !== 9) {
    return input;
  }
  const operator = normalized.substring(0, 3);
  const part1 = normalized.substring(3, 6);
  const part2 = normalized.substring(6, 9);
  return `+967 ${operator} ${part1} ${part2}`;
}

/**
 * Formats a local representation
 * e.g. 777123456 -> 777 123 456
 */
export function formatLocalYemeniPhone(input: string): string {
  const normalized = normalizeYemeniPhone(input);
  if (!normalized || normalized.length !== 9) {
    return input;
  }
  return `${normalized.substring(0, 3)} ${normalized.substring(3, 6)} ${normalized.substring(6, 9)}`;
}

/**
 * Generates a direct WhatsApp link
 * e.g. https://wa.me/967777123456
 */
export function getYemeniWhatsAppLink(phone: string, defaultMessage?: string): string {
  const normalized = normalizeYemeniPhone(phone);
  if (!normalized) return '#';
  const fullIntl = `967${normalized}`;
  if (defaultMessage) {
    return `https://wa.me/${fullIntl}?text=${encodeURIComponent(defaultMessage)}`;
  }
  return `https://wa.me/${fullIntl}`;
}

/**
 * Returns mobile operator name in Yemen
 */
export function getYemeniOperatorName(phone: string): string {
  const normalized = normalizeYemeniPhone(phone);
  if (!normalized || normalized.length < 2) return '';
  const prefix = normalized.substring(0, 2);
  switch (prefix) {
    case '77':
    case '78':
      return 'يمن موبايل (Yemen Mobile)';
    case '73':
      return 'يو (YOU / MTN)';
    case '71':
      return 'سبأفون (Sabafon)';
    case '70':
      return 'واي (Y Telecom)';
    default:
      return 'شبكة اتصالات يمنية';
  }
}
