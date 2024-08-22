/**
 * 生成 uuid
 * @param length 长度
 * @param separator 分隔符
 * @returns 
 */
export function uuid(length = 16, separator ="") {
    const res: string[] = [];
    for (let i = 0; i < length / 4; i++) {
      res.push(((Math.random() * 1e6) >> 0).toString(36));
    }
    return res.join(separator);
  }