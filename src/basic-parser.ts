import * as fs from "fs";
import * as readline from "readline";
import { z } from "zod";

export async function* parseCSVStream<T>(path: string, schema: z.Schema<T>, hasHeader = true):
    // TN: notice how the "z.Schema<T>" version differs from the "z.Schema" version!!
    // (Mouse over the yield below under both versions to see.)
    AsyncGenerator<T, void, unknown> {
    const fileStream = fs.createReadStream(path);
    const rl = readline.createInterface({ // read line interface to read line by line
        input: fileStream,
        crlfDelay: Infinity, // handle different line endings
    });

    // holding headers for the first line if hasHeader is true
    let headers: string[] | null = null;
    let rowCount = 0

    // asynchronous iteration over each line in the file
    for await (const line of rl) {
        const values = line.split(",").map((v) => v.trim());
    
        if (hasHeader && !headers) { // if first line and hasHeader is true, set headers
            headers = values;
            continue; // do not process as data
        }

        // constructing an object mapping headers to values 
        // or return values as an array if no headers
        const data = hasHeader && headers
        ? Object.fromEntries(headers.map((h, i) => [h, values[i] ?? null]))
        : values; // validation for header 

        // validating the data against the provided schema.
        // Beware! 
        const result = schema.safeParse(data); 
        rowCount++

        if (result.success) {
            yield result.data;
        } else {
            // TN: It isn't the parser's job to write to the console. 
            // Imagine this is running in a webapp; the end user won't 
            // see the error. We need to enable the caller to do something.
            //   (This includes the _tests_, which can't easily detect console.logs.)
            // Producing `undefined` doesn't communicate the error data. 
            // Using _return_ will stop the parser early. 
            // So could use a union type to _yield_ something, and continue.
            // What do _you_ think is best here? There are probably multiple OK options.
            // yield  ???
            console.log('Should not be a console.log')
        }
    }
}