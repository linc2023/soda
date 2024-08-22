//  @ts-nocheck
// import * as ts from "typescript";
// import { TSLanguageServiceHost } from "./ts";

import { parseCommandArgv } from "./utils";
import * as path from "node:path";
// const langinaService = ts.createLanguageService(
//   new TSLanguageServiceHost(),
//   ts.createDocumentRegistry()
// );

// langinaService;

main(process.argv);

function main(argv: string[]) {
  const options = parseCommandArgv(argv.splice(2));
  execCommand(options[0], options);
}
function execCommand(commandName: string, options: Record<string, string>) {
  switch (commandName) {
    case "build":
      (require("./build") as typeof import("./build")).build(options[1] || ".", {
        outDir: options["--out-dir"],
      });
  }
}
