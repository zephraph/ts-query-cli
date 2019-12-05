# ts-query-cli

## Usage

```
ts-query [path] [query] <selector>
```

## Useful queries

Find all usages of [reaction](https://github.com/artsy/reaction) in [force](https://github.com/artsy/force)

```
ts-query ~/Git/Artsy/force/src "ImportDeclaration > StringLiteral[text=/^(@artsy.)?reaction.*/]" text
```
