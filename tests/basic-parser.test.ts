import { parseCSVStream } from "../src/basic-parser";
import * as path from "path";

const PEOPLE_CSV_PATH = path.join(__dirname, "../data/people.csv");

test("parseCSVStream yields arrays", async () => {
  const results = [];
  for await (const row of parseCSVStream(PEOPLE_CSV_PATH)) {
    results.push(row);
  }
  expect(results).toHaveLength(5);
  expect(results[0]).toEqual(["name", "age"]);
  expect(results[1]).toEqual(["Alice", "23"]);
  expect(results[2]).toEqual(["Bob", "thirty"]); // why does this work? :(
  expect(results[3]).toEqual(["Charlie", "25"]);
  expect(results[4]).toEqual(["Nim", "22"]);
});

test("parseCSVStream yields only arrays", async () => {
  for await (const row of parseCSVStream(PEOPLE_CSV_PATH)) {
    expect(Array.isArray(row)).toBe(true);
  }
});
