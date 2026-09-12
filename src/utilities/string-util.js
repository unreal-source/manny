/** Capitalize the first letter of a string
 * @param {string} string - The string you want to capitalize
*/
export function capitalize (string) {
  return `${string.charAt(0).toUpperCase()}${string.slice(1)}`
}

/** Remove leading/trailing whitespace while preserving line breaks
 * @param {string} string - The string you want to format
*/
export function dedent (strings, ...values) {
  const raw = typeof strings === 'string' ? [strings] : strings.raw
  let result = raw.map((str, i) => `${str}${values[i] ?? ''}`).join('')
  result = result.replace(/^\n/, '')
  const lines = result.split('\n')
  const indent = lines
    .filter(line => line.trim()) // ignore blank lines
    .reduce((min, line) => {
      const match = line.match(/^(\s*)/)
      const len = match ? match[1].length : 0
      return Math.min(min, len)
    }, Infinity)

  const trimmed = lines
    .map(line => line.slice(indent))
    .join('\n')

  return trimmed.trimEnd() // leave leading space if intentional, remove trailing
}
