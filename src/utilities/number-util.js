/** Add thousand separators to a number
 * @param {number} num - The number you want to add thousand separators to
*/
export function thousands (num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
