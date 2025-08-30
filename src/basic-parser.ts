import * as fs from "fs";
import * as readline from "readline";

export async function* parseCSVStream(path: string) {
  const fileStream = fs.createReadStream(path);
  const rl = readline.createInterface({
    // read line interface to read line by line
    input: fileStream,
    crlfDelay: Infinity, // handle different line endings
  });

  for await (const line of rl) {
    const values = line.split(",").map((v) => v.trim());
    yield values;
  }
}
