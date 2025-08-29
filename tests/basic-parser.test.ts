import { parseCSVStream } from "../src/basic-parser";
import * as fs from "fs";
import * as path from "path";
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

test("parseCSVStream yields objects with headers", async () => {
  const results = [];
  for await (const row of parseCSVStream(TEST_CSV_PATH)) {
    results.push(row);
  }
  expect(results).toHaveLength(5);
  expect(results[0]).toEqual({ name: "Alice", age: "23" });
  expect(results[1]).toEqual({ name: "Bob", age: "19" });
  expect(results[2]).toEqual({ name: "Charlie", age: "-5" });
  expect(results[3]).toEqual({ name: "Dana", age: "notanumber" }); // this should not work!
  expect(results[4]).toEqual({ name: "Eve", age: "42" });
});

test("parseCSVStream yields arrays without headers", async () => {
  const results = [];
  for await (const row of parseCSVStream(TEST_CSV_PATH, false)) {
    results.push(row);
  }
  expect(results).toHaveLength(6);
  expect(results[0]).toEqual(["name", "age"]);
  expect(results[1]).toEqual(["Alice", "23"]);
  expect(results[2]).toEqual(["Bob", "19"]);
  expect(results[3]).toEqual(["Charlie", "-5"]);
  expect(results[4]).toEqual(["Dana", "notanumber"]);
  expect(results[5]).toEqual(["Eve", "42"]);
});
