import * as ts from "typescript";
const reactDefaultFunctions = ["setState", "forceUpdate", "render", "componentWillReceiveProps", "componentWillMount", "componentWillUnmount", "componentDidMount", "shouldComponentUpdate", "getSnapshotBeforeUpdate", "componentWillUpdate", "componentDidUpdate", "componentDidCatch", "UNSAFE_componentWillMount", "UNSAFE_componentWillReceiveProps", "UNSAFE_componentWillUpdate"];
const reactDefaultProperties = ["context", "props", "state", "refs"];

type FormDescriptor = { type: string; children?: FormDescriptor[] }[];
type PropertyDescriptor = {
  name: string;
  disabled?: boolean;
  hidden?: string;
  description?: string;

  label: string;
  tab?: string;
  category?: string;
  expanded?: boolean;
  order: number;

  formDescriptor?: FormDescriptor;
};

/**
 * 转换属性
 * @param property
 * @param checker
 * @returns
 */
export function parseClassProperties(property: ts.Symbol, checker: ts.TypeChecker) {
  // 去除 react 内置方法、属性
  if (reactDefaultFunctions.includes(property.name) || reactDefaultProperties.includes(property.name)) {
    return null;
  }
  const declaration = property.declarations![0];

  const flags = property.getFlags();
  const descriptor: PropertyDescriptor = { formDescriptor: [] } as unknown as PropertyDescriptor;
  descriptor.name = property.name;
  parseBaseDescriptor(property, checker, descriptor);

  if (flags & ts.SymbolFlags.Property) {
    const type = checker.getTypeOfSymbolAtLocation(property, declaration);
    parseType(type, checker, descriptor.formDescriptor);
  }
  if (["onClick", "setText", "getText"].includes(property.name)) {
    // debugger;
  }
  if (flags & ts.SymbolFlags.Method) {
    console.log();
    // descriptor.type = "Function";
  }
  return descriptor;
}

/**
 * 解析属性公共部分
 * @param property 属性名称
 * @param checker 语义分析器
 * @param descriptor 解析结果
 * @returns
 */
function parseBaseDescriptor(property: ts.Symbol, checker: ts.TypeChecker, descriptor: PropertyDescriptor) {
  const declaration = property.declarations![0];

  const modifiers = ts.getCombinedModifierFlags(declaration);
  if (modifiers & ts.ModifierFlags.Private) {
    descriptor.hidden = "return true";
  }
  if (modifiers & ts.ModifierFlags.Readonly) {
    descriptor.disabled = true;
  }
  let jsDoc: ts.JSDoc = (ts.getJSDocCommentsAndTags(declaration) as ts.JSDoc[])[0];
  /** 如果当前属性不存在注释，读取父属性 */
  if (!jsDoc) {
    // TODO: 读取多级父类注释
    const parentClass = property["parent"].declarations[0].heritageClauses[0].types[0].expression as ts.Node;
    const parentSymbol = checker.getSymbolAtLocation(parentClass)!;
    const parentType = checker.getDeclaredTypeOfSymbol(parentSymbol);
    if (parentType.isClass()) {
      const propertyDeclarations = parentType.getProperty(property.name)?.declarations![0];
      if (propertyDeclarations) {
        jsDoc = (ts.getJSDocCommentsAndTags(propertyDeclarations) as ts.JSDoc[])[0];
      }
    }
    if (!jsDoc) {
      return;
    }
  }
  /** 解析注释 */
  if (jsDoc.comment) {
    descriptor.description = ts.getTextOfJSDocComment(jsDoc.comment);
  }
  if (jsDoc.tags) {
    for (let i = 0; i < jsDoc.tags.length; i++) {
      const tag = jsDoc.tags[i];
      const tagName = tag.tagName.text;
      const comment = ts.getTextOfJSDocComment(tag.comment);
      if (tagName === "label") {
        parseLabel(comment ?? "");
      } else if (tagName === "hidden") {
        descriptor.hidden = comment ? comment : "true";
      } else if (tagName === "order") {
        descriptor.order = comment ? +comment : 0;
      }
    }
  }

  function parseLabel(label: string) {
    if (label.length === 0) {
      label = property.name;
    }
    const arr = label.split("/");

    descriptor.label = arr[arr.length - 1];
    if (arr.length > 1) {
      descriptor.tab = arr[0];
    }
    if (arr.length === 3) {
      if (arr[1].endsWith("-")) {
        descriptor.expanded = false;
      }
      descriptor.category = arr[1].replace(/\+$/, "");
    }
  }
}
/**
 * 解析属性类型
 * @param type 类型
 * @param checker 语义解析器
 * @param descriptor 解析结果
 */
function parseType(type: ts.Type, checker: ts.TypeChecker, formDescriptor: PropertyDescriptor["formDescriptor"] = []) {
  const TypeFlags = type.getFlags();
  if (TypeFlags & ts.TypeFlags.String) {
    formDescriptor.push({ type: "string" });
    return;
  }
  if (TypeFlags & (ts.TypeFlags.Number | ts.TypeFlags.BigInt)) {
    formDescriptor.push({ type: "number" });
    return;
  }
  if (TypeFlags & ts.TypeFlags.Boolean) {
    formDescriptor.push({ type: "boolean" });
    return;
  }

  if (TypeFlags & ts.TypeFlags.Object) {
    const descriptors = [];
    if (checker.isArrayType(type)) {
      parseType((type["typeArguments"] as ts.Type[])[0], checker, descriptors);
      formDescriptor.push({
        type: "array",
        children: descriptors,
      });
      return;
    }
    if (checker.isTupleType(type)) {
      (type["typeArguments"] as ts.Type[]).map((typeArgument) => parseType(typeArgument, checker, descriptors));
      formDescriptor.push({
        type: "tuple",
        children: descriptors,
      });
      return;
    }
    // type.getProperties().map((prop) => parseType(checker.getTypeOfSymbolAtLocation(prop, prop.declarations![0]), checker, descriptors));
    formDescriptor.push({
      type: "object",
      children: descriptors,
    });
  }

  checker;
}

// function parseFunction() {}
