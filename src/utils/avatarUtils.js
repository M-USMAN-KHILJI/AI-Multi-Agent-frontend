/**
 * Helper to compute first name initial and last name initial
 * e.g., "Muhammad Usman Khurram" -> "MK"
 *       "Usman Khilji"           -> "UK"
 *       "Usman"                  -> "U"
 */
export const getFirstAndLastInitials = (name) => {
  if (!name || typeof name !== 'string') return 'U'
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'U'
  if (parts.length === 1) return parts[0].substring(0, 1).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export default getFirstAndLastInitials

