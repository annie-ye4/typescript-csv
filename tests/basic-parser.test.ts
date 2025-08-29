import { parseCSVStream } from "../src/basic-parser";
import * as fs from "fs";
import * as path from "path";
import { PersonRecord, PersonSchema } from "../src/validators/person-schema";
import { z } from "zod";

const TEST_CSV_PATH = path.join(__dirname, "test-persons.csv");

beforeAll(() => {
  fs.writeFileSync(
    TEST_CSV_PATH,
    [
      "name,age",
      "Alice,23",
      "Bob,19",
      "Charlie,-5", // invalid negative age
      "Dana,notanumber", // invalid, not a number
      "Eve,42",
    ].join("\n")
  );
});

// cleanup after tests
afterAll(() => {
  fs.unlinkSync(TEST_CSV_PATH);
});

test("parseCSVStream yields only valid Person records", async () => {
  const results = [];

  const foo = await parseCSVStream(TEST_CSV_PATH, PersonSchema);
  const bar = await foo.next();
  for await (const person of parseCSVStream(TEST_CSV_PATH, PersonSchema)) {
    results.push(person);
  }
  expect(results).toHaveLength(3);
  expect(results[0]).toEqual({ name: "Alice", age: 23 });
  expect(results[1]).toEqual({ name: "Bob", age: 19 });
  expect(results[2]).toEqual({ name: "Eve", age: 42 });
});

test("parseCSVStream skips invalid rows", async () => {
  const results = [];
  for await (const person of parseCSVStream(TEST_CSV_PATH, PersonSchema)) {
    results.push(person);
  }
  // Charlie and Dana should be skipped
  expect(results.find((p) => p.name === "Charlie")).toBeUndefined();
  expect(results.find((p) => p.name === "Dana")).toBeUndefined();
});
