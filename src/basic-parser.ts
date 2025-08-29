import * as fs from "fs";
import * as readline from "readline";

export async function* parseCSVStream(path: string, hasHeader = true) {
  const fileStream = fs.createReadStream(path);
  const rl = readline.createInterface({
    // read line interface to read line by line
    input: fileStream,
    crlfDelay: Infinity, // handle different line endings
  });

  // holding headers for the first line if hasHeader is true
  let headers: string[] | null = null;
  let rowCount = 0;

  // asynchronous iteration over each line in the file
  for await (const line of rl) {
    const values = line.split(",").map((v) => v.trim());

    if (hasHeader && !headers) {
      // if first line and hasHeader is true, set headers
      headers = values;
      continue; // do not process as data
    }

    // constructing an object mapping headers to values
    // or return values as an array if no headers
    const data =
      hasHeader && headers
        ? Object.fromEntries(headers.map((h, i) => [h, values[i] ?? null]))
        : values; // validation for header

    yield data;
  }
}
