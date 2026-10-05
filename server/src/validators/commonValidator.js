import { z } from "zod";

/** For routes like /something/:id -> validate(idParamSchema, "params") */
export const idParamSchema = z.object({
  id: z.string().regex(/^[a-f0-9]{24}$/i, "Invalid id"),
});