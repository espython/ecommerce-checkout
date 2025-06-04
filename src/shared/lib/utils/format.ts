/**
 * Format a number as currency, with options for specifying currency code and locale
 *
 * @param amount - The amount to format
 * @param currencyCode - The ISO currency code (default: USD)
 * @param locale - The locale to use for formatting (default: en-US)
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number,
  currencyCode = 'USD',
  locale = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Format a date according to the specified locale and options
 *
 * @param date - The date to format
 * @param locale - The locale to use for formatting (default: en-US)
 * @param options - DateTimeFormat options
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string | number,
  locale = 'en-US',
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
): string {
  const dateObj =
    typeof date === 'string' || typeof date === 'number' ? new Date(date) : date

  return new Intl.DateTimeFormat(locale, options).format(dateObj)
}

/**
 * Convert a string to title case
 *
 * @param text - The string to convert
 * @returns Title cased string
 */
export function toTitleCase(text: string): string {
  return text.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
  )
}

/**
 * Format a number with commas as thousands separators
 *
 * @param value - The number to format
 * @returns Formatted number string
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat().format(value)
}

/**
 * Truncate a string to a specified length and add ellipsis if needed
 *
 * @param text - The string to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated string
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.substring(0, maxLength).trim()}...`
}
