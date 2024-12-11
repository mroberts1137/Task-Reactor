export const sanitizeString = (input: string): string => {
  if (typeof input !== 'string') return '';

  // Remove any HTML tags
  let sanitized = input.replace(/<[^>]*>?/gm, '');

  // Escape special characters that could be used for XSS
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');

  // Remove potential SQL injection patterns
  sanitized = sanitized
    .replace(/'/g, '')
    .replace(/;/g, '')
    .replace(/--/g, '')
    .replace(/\/\*/g, '')
    .replace(/\*\//g, '')
    .replace(/xp_/gi, '')
    .replace(/UNION/gi, '')
    .replace(/SELECT/gi, '')
    .replace(/DROP/gi, '')
    .replace(/DELETE/gi, '')
    .replace(/UPDATE/gi, '');

  return sanitized.trim();
};

export const sanitizeNumber = (input: string): number => {
  // Parse the input as a float and return 0 if it's not a valid number
  const num = parseFloat(input);
  return isNaN(num) ? 0 : Math.max(0, num);
};

export const sanitizeDate = (input: string): Date | null => {
  const date = new Date(input);
  return isNaN(date.getTime()) ? null : date;
};
