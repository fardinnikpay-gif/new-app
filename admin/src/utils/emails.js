import { z } from "zod";

const emailSchema = z.string().email();
const SEPARATORS = /[\s,;]+/;

export const isValidEmail = (value) => emailSchema.safeParse(value).success;

// Adds the addresses found in `text` to `current` (lowercased, no duplicates, up to `max`).
// Invalid tokens are returned so they can stay in the input for fixing.
export const addEmails = (current, text, max) => {
  const emails = [...current];
  const invalid = [];
  let overflow = false;

  for (const token of text.split(SEPARATORS).filter(Boolean)) {
    const email = token.toLowerCase();
    if (!isValidEmail(email)) invalid.push(token);
    else if (emails.includes(email)) continue;
    else if (emails.length >= max) overflow = true;
    else emails.push(email);
  }

  return { emails, invalid, overflow };
};

export const describeEmailProblems = ({ invalid, overflow }, max) => {
  const problems = [];
  if (invalid.length > 0) problems.push(`Not a valid email: ${invalid.join(", ")}`);
  if (overflow) problems.push(`You can add up to ${max} emails`);
  return problems.join(". ");
};