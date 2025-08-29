import { parseCSVStream } from "../src/basic-parser";
import * as fs from "fs";
import * as path from "path";
import { z } from "zod";

const PEOPLE_CSV_PATH = path.join(__dirname, "../data/people.csv");

test("parseCSVStream yields objects with headers", async () => {
  const results = [];
  for await (const row of parseCSVStream(PEOPLE_CSV_PATH)) {
    results.push(row);
  }
  expect(results).toHaveLength(3);
  expect(results[0]).toEqual({ name: "Alice", age: "23" });
  expect(results[1]).toEqual({ name: "Bob", age: "thirty" }); // this should not work
  expect(results[2]).toEqual({ name: "Charlie", age: "25" });
});

test("parseCSVStream yields arrays without headers", async () => {
  const results = [];
  for await (const row of parseCSVStream(PEOPLE_CSV_PATH, false)) {
    results.push(row);
  }
  expect(results).toHaveLength(4);
  expect(results[0]).toEqual(["name", "age"]);
  expect(results[1]).toEqual(["Alice", "23"]);
  expect(results[2]).toEqual(["Bob", "thirty"]); // this should not work
  expect(results[3]).toEqual(["Charlie", "25"]);
});
