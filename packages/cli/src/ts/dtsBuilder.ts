import * as ts from "typescript";
import { TextWriter } from "../utils";

const Compiler_Options: ts.CompilerOptions = {
  target: ts.ScriptTarget.ES2021,
  newLine: ts.NewLineKind.LineFeed,
  jsx: ts.JsxEmit.React,
  jsxFactory: "jsx",
  jsxFragmentFactory: "jsx.Fragment",
  experimentalDecorators: true,
  useDefineForClassFields: false,
  preserveConstEnums: true,
  stripInternal: true,
  alwaysStrict: false,
  forceConsistentCasingInFileNames: true,
  resolveJsonModule: true,
  suppressImplicitAnyIndexErrors: true,
  strictPropertyInitialization: false,
  noImplicitOverride: true,
  module: ts.ModuleKind.AMD,
  moduleResolution: ts.ModuleResolutionKind.NodeJs,
  allowJs: true,
  declaration: true,
  emitDeclarationOnly: true,
  sourceMap: false,
  outDir: "",
};

class DTSBuilder {
  compilerOption: ts.CompilerOptions;
  compilerHost: ts.CompilerHost;
  /** 根路径 */
  rootDir: string;
  /** 包名 */
  bundleName: string;
  /** 文本写入器 */
  writer: TextWriter;
  /** 不需要解析的模块 */
  externals: string[];
  /** 当前模块的 import */
  imports: { modulePath: string; moduleName: string }[];
  importSet = new Set<string>();

  /** ts 程序 */
  program: ts.Program;
  typeChecker: ts.TypeChecker;

  constructor(rootDir: string, bundleName: string, externals: string[] = []) {
    this.writer = new TextWriter();
    this.bundleName = bundleName;
    this.compilerOption = {
      ...Compiler_Options,
      ...this.getDefaultTSConfig(rootDir),
      outDir: rootDir,
    };
    this.rootDir = rootDir;
    this.externals = externals;
    this.imports = [];
  }

  getDefaultTSConfig(rootDir: string) {
    const configFileHost: ts.ParseConfigHost = {
      useCaseSensitiveFileNames: ts.sys.useCaseSensitiveFileNames,
      readDirectory() {
        return [];
      },
      fileExists: () => true,
      readFile: ts.sys.readFile,
    };
    const configFilePath = ts.findConfigFile(rootDir, ts.sys.fileExists);
    if (!configFilePath) {
      return {};
    }
    const configFile = ts.readConfigFile(configFilePath, ts.sys.readFile);
    const options = ts.parseJsonConfigFileContent(configFile.config, configFileHost, rootDir).options;
    return options;
  }

  build(inputFile: string) {
    this.compilerHost = ts.createCompilerHost(Compiler_Options);
    const program = ts.createProgram([inputFile], this.compilerOption, this.compilerHost);
    const entryFile = program.getSourceFile(inputFile);
    if (!entryFile) {
      return {
        program,
        diagnostics: [],
        code: "",
        entryFile,
      };
    }
    this.program = program;
    this.typeChecker = program.getTypeChecker();
    this.emitFile(entryFile);
    return {
      program,
      diagnostics: [],
      entryFile,
      code: this.writer.toString(),
    };
  }
  renameModule = (relativePath: string, absolutedPath: string) => {
    const isExcluded = this.externals.some((external) => external === relativePath || relativePath.startsWith(`${external}/`));
    if (isExcluded) {
      return relativePath;
    }
    const moduleName = this.formatModuleName(relativePath);
    this.imports.push({ modulePath: absolutedPath, moduleName });
    return moduleName;
  };
  emitFile(sourceFile: ts.SourceFile, moduleName: string = this.bundleName) {
    const { writer } = this;
    const writeFile = (_, content) => {
      writer.write(writer.eol());
      writer.write(`declare module "${moduleName}" {`);
      writer.indent();
      writer.writeLine(content);
      writer.unindent();
      writer.write("}");
    };
    this.program.emit(sourceFile, writeFile, undefined, true, {
      afterDeclarations: [createDTSTransformer(this.renameModule, sourceFile, this.typeChecker)],
    });
    const imports = this.imports;
    for (const { modulePath, moduleName } of imports) {
      const file = this.program.getSourceFile(modulePath);
      if (file && !this.importSet.has(modulePath)) {
        this.importSet.add(modulePath);
        this.emitFile(file, moduleName);
      }
    }
    this.imports.length = 0;
  }
  formatModuleName(modulePath: string) {
    if (modulePath.startsWith("./") || modulePath.startsWith("../")) {
      const moduleName = modulePath
        .replace(/(\.\/)/g, "")
        .replace(/(\.\.\/)/g, "")
        .replace(/\.scss$|\.less$/i, ".css")
        .replace(/\.d\.ts$|\.tsx?$|\.jsx?$/, "");
      return this.bundleName + "/" + moduleName;
    }
    return modulePath;
  }
}

function createDTSTransformer(renameModule: (moduleName: string, moduleResolvedPath: string) => string, sourceFile: ts.SourceFile, typeChecker: ts.TypeChecker): ts.CustomTransformerFactory {
  return (ctx) => {
    sourceFile;
    return {
      transformSourceFile(node: ts.SourceFile): ts.SourceFile {
        return ts.visitEachChild(node, visitNode, ctx);
      },
      transformBundle(node: ts.Bundle): ts.Bundle {
        return ts.visitEachChild(node, visitNode, ctx);
      },
    };
    function visitNode(node: ts.Node) {
      if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
        // 去掉 import "./xxx" 或者 import "xxx"
        if (!node.importClause) {
          return null;
        }
        // import a from './xxx' -> import a from '@a/b/xxx'
        return ctx.factory.updateImportDeclaration(node, node.modifiers, node.importClause, ctx.factory.createStringLiteral(renameModule(node.moduleSpecifier.text, resolveModulePath(node.moduleSpecifier))), node.attributes);
      }
      if (ts.isExportDeclaration(node) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
        // export a from './xxx' -> export a from '@a/b/xxx'
        return ctx.factory.updateExportDeclaration(node, node.modifiers, node.isTypeOnly, node.exportClause, ctx.factory.createStringLiteral(renameModule(node.moduleSpecifier.text, resolveModulePath(node.moduleSpecifier))), node.attributes);
      }
      // 删除默认的 declare
      if (node.kind === ts.SyntaxKind.DeclareKeyword) {
        return null;
      }
      return ts.visitEachChild(node, visitNode, ctx);
    }
    function resolveModulePath(moduleSpecifier: ts.Node) {
      const importFileSymbol = typeChecker.getSymbolAtLocation(moduleSpecifier);
      // @ts-expect-error
      return importFileSymbol?.valueDeclaration?.path || "";
    }
  };
}

export function createDTSBuidler(rootDir: string, bundleName: string, externals: string[] = []) {
  return new DTSBuilder(rootDir, bundleName, externals);
}
