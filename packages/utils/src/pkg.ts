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
