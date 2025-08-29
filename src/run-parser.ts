import { parseCSVStream } from "./basic-parser";

const DATA_FILE = "../data/people.csv"; // update with your actual file name

async function main() {
  for await (const record of parseCSVStream(DATA_FILE)) {
    console.log(record);
  }
}

main();

// run with npx ts-node run-parser.ts