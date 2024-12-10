export const sanitizeString = (input: string): string => {
  // Remove any HTML tags and trim whitespace
  return input.replace(/<[^>]*>?/gm, '');
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
