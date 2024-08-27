/**
 * 包名转小驼峰
 * @param packageName 包名
 * @returns
 */
export function packageNameToCamelCase(packageName: string) {
  const scopeMatch = packageName.match(/^@([^/]+)/);
  let scope = "";
  if (scopeMatch) {
    scope = scopeMatch[1].toLowerCase();
    // packageName = packageName.slice(scope.length + 2);
    packageName = packageName[scope.length + 2].toUpperCase() + packageName.slice(scope.length + 3);
  }

  // 将包名转换为小驼峰形式
  const camelCaseName = packageName
    .split(/-/)
    .map((word, index) => (index === 0 && scope.length === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()))
    .join("");

  return scope ? `${scope}${camelCaseName}` : camelCaseName;
}

/**
 * 获取主版本
 * @param version
 * @returns
 */
export function getMainVersion(version: string) {
  return version?.length > 0 ? version.split(".")[0] : "1";
}
/**
 * 获取包名
 * @param pkg
 * @returns
 */
export function getLibName(library: string, name: string = "") {
  return `${library ?? packageNameToCamelCase(name)}`;
}
