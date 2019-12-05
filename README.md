# ts-query-cli

## Usage

```
node index.js [path] [query] <selector>
```

## Useful queries

Find all usages of reaction in force

```
node index.js ~/Git/Artsy/force/src "ImportDeclaration > StringLiteral[text=/^(@artsy.)?reaction.*/]" text
```
