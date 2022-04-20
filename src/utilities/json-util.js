import { readFile } from 'node:fs/promises'

/** Import and parse a JSON file.
 * @param {String} path - The path to the JSON file you want to import
*/
export async function importJson (path) {
  return JSON.parse(await readFile(path))
}
