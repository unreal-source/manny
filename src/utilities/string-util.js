/** Capitalize the first letter of a string
 * @param {string} string - The string you want to capitalize
*/
export function capitalize (string) {
  return `${string.charAt(0).toUpperCase()}${string.slice(1)}`
}
