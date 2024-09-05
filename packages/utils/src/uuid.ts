/**
 * 生成 uuid
 * @param length 长度
 * @param separator 分隔符
 * @returns
 */
export function uuid(length = 16, separator = "") {
  const res: string[] = [];
  for (let i = 0; i < length / 4; i++) {
    res.push(((Math.random() * 1e6) >> 0).toString(36));
  }
  return res.join(separator);
}
/**
 * 获取 hash
 * @param str
 * @param base
 * @returns
 */
export function hashCode(str: string, base: number = 16) {
  let hash = 0,
    i,
    chr;
  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash.toString(base);
}
