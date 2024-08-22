import { readFileSync } from "fs";
import { extname, resolve } from "path";
import * as ts from "typescript";
import { parseClassProperties } from "./classPaser";
import { encodeDataURI, getMimeType } from "@soda/utils";

type ComponentDescriptor = {};
/**
 * 获取组件信息
 * @param sourceFile 入口文件 AST
 * @param typeChecker 语义分析器
 * @returns
 */
export function getComponentDescriptors(sourceFile: ts.SourceFile, typeChecker: ts.TypeChecker): ComponentDescriptor[] {
  const moduleSymbol = typeChecker.getSymbolAtLocation(sourceFile) ?? typeChecker.getAmbientModules().find((symbol) => symbol.getDeclarations()?.[0]?.getSourceFile() === sourceFile);
  if (moduleSymbol) {
    const exportedSymbols = typeChecker.getExportsOfModule(moduleSymbol);
    return exportedSymbols
      .map((exportedSymbol) => parseComponent(exportedSymbol, typeChecker))
      .filter(Boolean)
      .sort(({ order: o1 = 0 }, { order: o2 = 0 }) => o2 - o1);
  }
  return [];
}
/**
 * 转换单个模块
 * @param exportedSymbol
 * @param typeChecker
 * @returns
 */
function parseComponent(exportedSymbol: ts.Symbol, typeChecker: ts.TypeChecker): any {
  const component = typeChecker.getDeclaredTypeOfSymbol(exportedSymbol);
  if (!component.isClass()) {
    return null;
  }
  const symbol = component.symbol;
  const declaration = symbol.declarations![0];
  const descriptor = parseClassComments(declaration);
  descriptor.componentName = symbol.name;
  descriptor.propsMeta = component
    .getProperties()
    .map((property) => parseClassProperties(property, typeChecker))
    .filter(Boolean);
  return descriptor;
}

/**
 * 读取注释
 * @param declaration
 * @returns
 */
function parseClassComments(declaration: ts.Declaration) {
  const docs = ts.getJSDocCommentsAndTags(declaration) as ts.JSDoc[];
  const tags: Record<string, any> = {};
  const doc = docs[0];
  if (doc) {
    if (doc.comment) {
      tags.description = ts.getTextOfJSDocComment(doc.comment);
    }
    if (Array.isArray(doc.tags)) {
      doc.tags.forEach((tag) => {
        tags[tag.tagName.text] = ts.getTextOfJSDocComment(tag.comment);
      });
    }
  }
  // 图标
  if (tags.icon) {
    const filePath: string = declaration.getSourceFile().fileName;
    const dir = filePath.substring(0, filePath.lastIndexOf("/") + 1);
    tags.icon = encodeDataURI(getMimeType(extname(tags.icon)), readFileSync(resolve(dir, tags.icon)));
  }
  // 隐藏
  const hidden = ts.getCombinedModifierFlags(declaration) & ts.ModifierFlags.Abstract;
  if (hidden || (!tags.hidden && Object.hasOwnProperty.call(tags, "hidden"))) {
    tags.hidden = "true";
  } else if (tags.hidden && !["true", "false"].includes(tags.hidden)) {
    try {
      tags.hidden = new Function("return " + tags.hidden)();
    } catch (error) {
      tags.hidden = undefined;
    }
  } else if ("false" === tags.hidden) {
    tags.hidden = undefined;
  }
  return tags;
}
