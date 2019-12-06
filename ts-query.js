#!/usr/bin/env node

const program = require("commander");
const files = require("filehound").create();
const fs = require("fs").promises;
const { tsquery } = require("@phenomnomnominal/tsquery");
const { default: PQueue } = require("p-queue");
const get = require("lodash.get");
const dedent = require("dedent");
const path = require("path");
const chalk = require("chalk");
const omit = require("deep-delete");

const queue = new PQueue({ concurrency: 5 });

const output = result => {
  if (typeof result === "string") {
    return chalk.yellow(result);
  } else {
    return result;
  }
};

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
      `);
      for (const node of nodes) {
        console.log("-", omit(["parent", "pos", "end"], node));
      }
      console.log("");
    }
  });

program
  .version(require("./package.json").version)
  .description(
    dedent`
    Takes in <path> and recursively parses all .ts and .tsx files. Returns any AST node
    that matches the tsquery (see below) <query> given. Optionally provide a [selector]
    which is a string based key selection like a.b.c to return a value from the AST node.

    For more info about building queries, see tsquery's repo:
    https://github.com/phenomnomnominal/tsquery
  `
  )
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

if (process.argv.length === 2) {
  program.outputHelp(chalk.red);
  process.exit(1);
}
