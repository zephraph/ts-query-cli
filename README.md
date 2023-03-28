# ts-query-cli

## Usage

```
ts-query [path] [query] <selector>
```

## Useful queries

Find all usages of [reaction](https://github.com/artsy/reaction) in [force](https://github.com/artsy/force)

```bash
ts-query ~/Git/Artsy/force/src "ImportDeclaration > StringLiteral[text=/^(@artsy.)?reaction.*/]" text
```

With improved output

```bash
ts-query /TypeScript-Node-Starter "Identifier[name='app']"
```

```console
file: C:\Projects\EdAnalytics\TypeScript-Node-Starter\test\contact.test.ts
Match at line 2, character 8:
  1: import request from "supertest";
  2: import app from "../src/app";
  3: import { expect} from "chai";
  4:
Match at line 7, character 17:
  5: describe("GET /contact", () => {
  6:     it("should return 200 OK", (done) => {
  7:         request(app).get("/contact")
  8:             .expect(200, done);
  9:     });
Match at line 15, character 17:
  13: describe("POST /contact", () => {
  14:     it("should return false from assert when no message is found", (done) => {
  15:         request(app).post("/contact")
  16:             .field("name", "John Doe")
  17:             .field("email", "john@me.com")
```
