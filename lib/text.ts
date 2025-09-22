/**
 * Utility functions for text processing and HTML cleaning
 */

/**
 * Clean HTML content and extract plain text
 * @param htmlContent - HTML string to clean
 * @returns Clean plain text
 */
export const cleanHtmlContent = (htmlContent: string): string => {
  if (typeof window === 'undefined') {
    // Server-side fallback - basic HTML tag removal
    return htmlContent
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
      .replace(/&amp;/g, '&') // Replace &amp; with &
      .replace(/&lt;/g, '<') // Replace &lt; with <
      .replace(/&gt;/g, '>') // Replace &gt; with >
      .replace(/&quot;/g, '"') // Replace &quot; with "
      .replace(/&#39;/g, "'") // Replace &#39; with '
      .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
      .trim();
  }

  // Client-side - use DOM parser for better HTML handling
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;

  // Get text content without HTML tags
  const textContent = tempDiv.textContent || tempDiv.innerText || '';

  // Clean up extra whitespace and normalize
  return textContent
    .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
    .replace(/\n\s*\n/g, '\n') // Replace multiple newlines with single newline
    .trim();
};

/**
 * Truncate text to a specified length with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

/**
 * Estimate reading time for text
 * @param text - Text to analyze
 * @param wordsPerMinute - Average reading speed (default: 200 wpm)
 * @returns Estimated reading time in seconds
 */
export const estimateReadingTime = (text: string, wordsPerMinute = 200): number => {
  const words = text.trim().split(/\s+/).length;
  return Math.ceil((words / wordsPerMinute) * 60);
};

/**
 * Format reading time for display
 * @param seconds - Time in seconds
 * @returns Formatted time string
 */
export const formatReadingTime = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds} seconds`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (remainingSeconds === 0) {
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
  }

  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};
