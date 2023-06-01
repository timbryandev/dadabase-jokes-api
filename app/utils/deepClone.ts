/**
 * Quick and dirty "deep cloning" using JSON.stringify/parse
 * Don't use on large arrays or objects if possible!
 * @param item
 */
const deepClone = <T extends any = null>(item: unknown): T =>
  JSON.parse(JSON.stringify(item))

export default deepClone
