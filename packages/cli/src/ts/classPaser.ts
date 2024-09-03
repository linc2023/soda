import * as ts from "typescript";
const reactDefaultFunctions = ["setState", "forceUpdate", "render", "componentWillReceiveProps", "componentWillMount", "componentWillUnmount", "componentDidMount", "shouldComponentUpdate", "getSnapshotBeforeUpdate", "componentWillUpdate", "componentDidUpdate", "componentDidCatch", "UNSAFE_componentWillMount", "UNSAFE_componentWillReceiveProps", "UNSAFE_componentWillUpdate"];
const reactDefaultProperties = ["context", "props", "state", "refs"];
import { PropDescriptor, EditorType } from "@soda/utils";

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
  const initializer = (declaration as ts.PropertyDeclaration).initializer;

  const flags = property.getFlags();
  const descriptor: PropDescriptor = { editorsProps: [] } as unknown as PropDescriptor;
  descriptor.name = property.name;

  parseBaseDescriptor(property, checker, descriptor);
  // 方法
  if (flags & (ts.SymbolFlags.Method | ts.SymbolFlags.Constructor | ts.SymbolFlags.Signature)) {
    praseFunctionSignature(property, checker, descriptor.editorsProps);
  } else if (flags & ts.SymbolFlags.Property) {
    const type = checker.getTypeOfSymbolAtLocation(property, declaration);
    const declarationType = (declaration as ts.PropertyDeclaration).type;
    const isMixin = declarationType && ts.isTypeReferenceNode(declarationType!) ? declarationType.typeName.getText() === "Mixin" : false;
    parseType(type, checker, descriptor.editorsProps, isMixin);
    // 有初始值的 Function 是 Method
    if (initializer && descriptor.editorsProps?.[0]?.type === EditorType.Function) {
      descriptor.editorsProps[0].type = EditorType.Method;
      // TODO: 解析方法参数默认值
      parseExpression;
    }
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
function parseBaseDescriptor(property: ts.Symbol, checker: ts.TypeChecker, descriptor: PropDescriptor) {
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
    if (arr.length === 1) {
      descriptor.tab = arr[0];
    }
    if (arr.length === 3) {
      if (arr[1].endsWith("-")) {
        descriptor.expanded = false;
      }
      descriptor.group = arr[1].replace(/\+$/, "");
    }
  }
}
/**
 * 解析属性类型
 * @param type 类型
 * @param checker 语义解析器
 * @param descriptor 解析结果
 */
function parseType(type: ts.Type, checker: ts.TypeChecker, descriptor: PropDescriptor["editorsProps"] = [], isMixin = false) {
  const typeFlags = type.getFlags();

  if (type.aliasSymbol) {
    if (type.aliasSymbol.flags & ts.SymbolFlags.Enum) {
      descriptor.push({ type: EditorType.Array });
      return;
    }
  }
  if (typeFlags & ts.TypeFlags.String) {
    descriptor.push({ type: EditorType.String });
    return;
  }
  if (typeFlags & (ts.TypeFlags.Number | ts.TypeFlags.BigInt)) {
    descriptor.push({ type: EditorType.Number });
    return;
  }
  if (typeFlags & (ts.TypeFlags.Boolean | ts.TypeFlags.BooleanLiteral)) {
    descriptor.push({ type: EditorType.Boolean });
    return;
  }
  // 对象
  if (typeFlags & ts.TypeFlags.Object) {
    const descriptors = [];
    const objectFlags = (type as ts.ObjectType).objectFlags;

    // 泛型
    if (objectFlags & ts.ObjectFlags.Reference) {
      // 数组
      if (checker.isArrayType(type)) {
        parseType((type["typeArguments"] as ts.Type[])[0], checker, descriptors);
        descriptor.push({ type: EditorType.Array, children: descriptors });
        return;
      }

      // 元组
      if (checker.isTupleType(type)) {
        (type["typeArguments"] as ts.Type[]).map((typeArgument) => parseType(typeArgument, checker, descriptors));
        descriptor.push({ type: EditorType.Tuple, children: descriptors });
        return;
      }
    }
    // 匿名对象
    if (objectFlags & ts.ObjectFlags.Anonymous) {
      const properties = checker.getPropertiesOfType(type);
      const stringIndexInfo = checker.getIndexInfoOfType(type, ts.IndexKind.String);
      const numberIndexInfo = checker.getIndexInfoOfType(type, ts.IndexKind.Number);
      const callSignatures = checker.getSignaturesOfType(type, ts.SignatureKind.Call);
      const constructSignatures = checker.getSignaturesOfType(type, ts.SignatureKind.Construct);
      if (!properties.length && !stringIndexInfo && !numberIndexInfo) {
        // 函数
        if (callSignatures.length === 1 && constructSignatures.length === 0) {
          descriptor.push({ type: EditorType.Function });
        }
      }
    } else {
      descriptor = [{ type: EditorType.Object, children: descriptors }];
    }
    return;
  }
  // 并集
  if (typeFlags & ts.TypeFlags.Union) {
    const types: { [prop: string]: ts.Type } = {};
    (type as ts.UnionOrIntersectionType).types.forEach((type) => (types[type.flags] = type));
    const result = Object.values(types).map((type) => {
      const editor: PropDescriptor["editorsProps"] = [];
      parseType(type, checker, editor);
      return editor;
    });
    if (isMixin) {
      descriptor.push(...result.flat());
    }
    return;
  }
}
/**
 * 解析函数
 * @param property
 * @param checker
 * @param descriptor
 */
function praseFunctionSignature(property: ts.Symbol, checker: ts.TypeChecker, descriptor: PropDescriptor["editorsProps"] = []) {
  property;
  checker;
  descriptor.push({ type: EditorType.Method });
}
/**
 * 解析表达式
 * @param expression
 */
function parseExpression(expression: ts.Expression | undefined) {
  return expression?.getText();
  if (!expression) {
    return;
  }
  const getValue = (value, type = "Function") => {
    return {
      type,
      value,
    };
  };
  const mergeValue = (...arr) => {
    let res = "";
    arr.forEach((i) => {
      const { value, type } = i ?? {};
      res += typeof value === "string" && type === "value" ? `"${value}"` : value;
    });
    return getValue(res);
  };
  switch (expression.kind) {
    case ts.SyntaxKind.StringLiteral:
      return getValue((expression as ts.StringLiteral).text, "value");
    case ts.SyntaxKind.NumericLiteral:
      return getValue(parseFloat((expression as ts.NumericLiteral).text), "value");
    case ts.SyntaxKind.BigIntLiteral:
      return getValue(BigInt((expression as ts.BigIntLiteral).text.replace(/n$/, "")), "value");
    case ts.SyntaxKind.FalseKeyword:
      return getValue(false, "value");
    case ts.SyntaxKind.TrueKeyword:
      return getValue(true, "value");
    case ts.SyntaxKind.NullKeyword:
      return getValue(null, "value");
    case ts.SyntaxKind.ThisKeyword:
      return getValue("this");
    case ts.SyntaxKind.SuperKeyword:
      return getValue("super");
    // 单目运算符
    case ts.SyntaxKind.PrefixUnaryExpression: {
      let operator = "";
      switch ((expression as ts.PrefixUnaryExpression).operator) {
        case ts.SyntaxKind.PlusToken:
          operator = "+";
          break;
        case ts.SyntaxKind.MinusToken:
          operator = "-";
          break;
        case ts.SyntaxKind.ExclamationToken:
          operator = "!";
          break;
        case ts.SyntaxKind.TildeToken:
          operator = "~";
          break;
        case ts.SyntaxKind.PlusPlusToken:
          operator = "++";
          break;
        default:
          operator = "--";
          break;
      }
      return mergeValue(getValue(operator), parseExpression((expression as ts.PrefixUnaryExpression).operand));
    }
    // 双目运算符
    case ts.SyntaxKind.BinaryExpression: {
      let operator = "";
      switch ((expression as ts.BinaryExpression).operatorToken.kind) {
        case ts.SyntaxKind.PlusToken:
          operator = "+";
          break;
        case ts.SyntaxKind.MinusToken:
          operator = "-";
          break;
        case ts.SyntaxKind.AsteriskToken:
          operator = "*";
          break;
        case ts.SyntaxKind.SlashToken:
          operator = "/";
          break;
        case ts.SyntaxKind.PercentToken:
          operator = "%";
          break;
        case ts.SyntaxKind.AsteriskAsteriskToken:
          operator = "**";
          break;
        case ts.SyntaxKind.AmpersandToken:
          operator = "&";
          break;
        case ts.SyntaxKind.BarToken:
          operator = "|";
          break;
        case ts.SyntaxKind.CaretToken:
          operator = "^";
          break;
        case ts.SyntaxKind.LessThanLessThanToken:
          operator = "<<";
          break;
        case ts.SyntaxKind.GreaterThanGreaterThanToken:
          operator = ">>";
          break;
        case ts.SyntaxKind.GreaterThanGreaterThanGreaterThanToken:
          operator = ">>>";
          break;
        case ts.SyntaxKind.AmpersandAmpersandToken:
          operator = "&&";
          break;
        case ts.SyntaxKind.BarBarToken:
          operator = "||";
          break;
        case ts.SyntaxKind.QuestionQuestionToken:
          operator = "??";
          break;
        case ts.SyntaxKind.EqualsEqualsToken:
          operator = "==";
          break;
        case ts.SyntaxKind.ExclamationEqualsToken:
          operator = "!=";
          break;
        case ts.SyntaxKind.EqualsEqualsEqualsToken:
          operator = "===";
          break;
        case ts.SyntaxKind.ExclamationEqualsEqualsToken:
          operator = "!==";
          break;
        case ts.SyntaxKind.LessThanToken:
          operator = "<";
          break;
        case ts.SyntaxKind.LessThanEqualsToken:
          operator = "<=";
          break;
        case ts.SyntaxKind.GreaterThanToken:
          operator = ">";
          break;
        case ts.SyntaxKind.GreaterThanEqualsToken:
          operator = ">=";
          break;
        case ts.SyntaxKind.InKeyword:
          operator = "in";
          break;
        case ts.SyntaxKind.InstanceOfKeyword:
          operator = "instanceof";
          break;
        case ts.SyntaxKind.EqualsToken:
          operator = "=";
          break;
        case ts.SyntaxKind.PlusEqualsToken:
          operator = "+=";
          break;
        case ts.SyntaxKind.MinusEqualsToken:
          operator = "-=";
          break;
        case ts.SyntaxKind.AsteriskEqualsToken:
          operator = "*=";
          break;
        case ts.SyntaxKind.SlashEqualsToken:
          operator = "/=";
          break;
        case ts.SyntaxKind.PercentEqualsToken:
          operator = "%=";
          break;
        case ts.SyntaxKind.AsteriskAsteriskEqualsToken:
          operator = "**=";
          break;
        case ts.SyntaxKind.AmpersandEqualsToken:
          operator = "&=";
          break;
        case ts.SyntaxKind.BarEqualsToken:
          operator = "|=";
          break;
        case ts.SyntaxKind.CaretEqualsToken:
          operator = "^=";
          break;
        case ts.SyntaxKind.LessThanLessThanEqualsToken:
          operator = "<<=";
          break;
        case ts.SyntaxKind.GreaterThanGreaterThanEqualsToken:
          operator = ">>=";
          break;
        case ts.SyntaxKind.GreaterThanGreaterThanGreaterThanEqualsToken:
          operator = ">>>=";
          break;
        case ts.SyntaxKind.AmpersandAmpersandEqualsToken:
          operator = "&&=";
          break;
        case ts.SyntaxKind.BarBarEqualsToken:
          operator = "||=";
          break;
        case ts.SyntaxKind.QuestionQuestionEqualsToken:
          operator = "??=";
          break;
        default:
          operator = ",";
          break;
      }
      const left = parseExpression((expression as ts.BinaryExpression).left);
      const right = parseExpression((expression as ts.BinaryExpression).right);
      return mergeValue(left, getValue(operator), right);
    }
    case ts.SyntaxKind.NoSubstitutionTemplateLiteral:
      // 没有变量的模板字符串
      return getValue((expression as ts.NoSubstitutionTemplateLiteral).text, "value");
    // 模板
    case ts.SyntaxKind.TemplateExpression:
      // const texts = result.texts = [(expression as ts.TemplateExpression).head.text]
      // const expressions = result.expressions = [] as ExpressionDescriptor[]
      // for (const span of (expression as ts.TemplateExpression).templateSpans) {
      //   texts.push(span.literal.text)
      //   expressions.push(parseExpression(span.expression))
      // }
      break;
    // 模板tag
    case ts.SyntaxKind.TaggedTemplateExpression:
      // a.tag = parseExpression((expression as ts.TaggedTemplateExpression).tag)
      // a.template = parseExpression((expression as ts.TaggedTemplateExpression).template) as StringLiteralExpressionDescriptor | TemplateLiteralExpressionDescriptor
      break;
  }
  console.log(expression);
}
