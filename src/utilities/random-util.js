/** Get a random element from an array
 * @param {array} arr - The array you want to get a random element from
 */
export function randomElement (arr) {
  return arr[(Math.random() * arr.length) | 0]
}

/** Get a random integer in the given range
 * @param {number} min - The minimum number in the given range
 * @param {number} max - The maximum number in the given range
*/
export function randomInteger (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
