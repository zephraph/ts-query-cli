const program = require("commander");
const files = require("filehound").create();
const fs = require("fs").promises;
const { tsquery } = require("@phenomnomnominal/tsquery");
const { default: PQueue } = require("p-queue");
const get = require("lodash.get");
const dedent = require("dedent");
const path = require("path");
const chalk = require("chalk");

const sleep = milliseconds => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};

const queue = new PQueue({ concurrency: 5 });

const queryFile = (originalPath, file, query, selector) =>
  fs.readFile(file, "utf8").then(contents => {
    const ast = tsquery.ast(contents);
    let nodes = tsquery(ast, query);
    if (selector) {
      nodes = nodes.map(node => get(node, selector));
    }
    if (nodes.length > 0) {
      console.log(dedent`
        file: ${chalk.blue(
          path.join(originalPath, path.relative(originalPath, file))
        )}
        ${nodes.map(n => `- ${chalk.yellow(n)}`).join("\n")}
      `);
      console.log("");
    }
  });

program
  .version(require("./package.json").version)
  .arguments("<path> <query> [selector]")
  .action(async (path, query, selector) => {
    console.log(query);
    files
      .paths(path)
      .ext(["ts", "tsx"])
      .find()
      .each(file => {
        queue.add(() => queryFile(path, file, query, selector));
      });
  });

program.parse(process.argv);
