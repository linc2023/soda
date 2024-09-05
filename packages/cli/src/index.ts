import { parseCommandArgv } from "./utils";
import { build } from "./scripts/build";
import { dev } from "./scripts/dev";

main(process.argv);

function main(argv: string[]) {
  const options = parseCommandArgv(argv.splice(2));
  execCommand(options[0], options);
}
function execCommand(commandName: string, options: Record<string, string>) {
  switch (commandName) {
    case "build":
      return build(options[1] || ".", {
        outDir: options["--out-dir"],
        platform: options["--platform"],
      });
    case "dev":
    case "serve":
      return dev(options[1] || ".", {
        host: options["--host"],
        port: parseInt(options["--port"]),
        open: options["--open"] === "true",
      });
  }
}
