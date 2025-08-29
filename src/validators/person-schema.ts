import { z } from "zod";

export const PersonSchema = z.object({
  name: z.string(),
  age: z
    .string()
    .regex(/^\d+$/, "Must be a number") // regex to ensure it's a number
    .transform((val) => parseInt(val, 10)) // transform to convert string to number
    .refine((val) => val >= 0), // TN: ensure that the age value is valid. 
      // TN: note that the above now expresses something richer than 
      // we usually think of types as providing.
})
// TN: attach a "brand", which exists only at static time, not runtime. 
// This prevents instances of the type (defined below) from being instantiated 
// accidentally, without going through Zod.
// See: https://zod.dev/api?id=branded-types
.brand<"Person">();

// TN: We want a Zod-generated type that TypeScript can work with.
// Notice that there is no () here. TypeScript uses <> instead for type-level operations.
export type PersonRecord = z.infer<typeof PersonSchema>
