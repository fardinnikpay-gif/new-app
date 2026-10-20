import { useCallback, useState } from "react";
import { addEmails, describeEmailProblems } from "../utils/emails";

// State of the "recipients" box: committed emails + the text being typed.
export default function useEmailList(max) {
  const [emails, setEmails] = useState([]);
  const [text, setTextValue] = useState("");
  const [error, setError] = useState("");

  const setText = useCallback((value) => {
    setTextValue(value);
    setError("");
  }, []);

  // Moves valid addresses from the text box into the list; invalid ones stay in the box.
  // Returns the new list so a submit can use it right away (state updates are async).
  const commit = useCallback(() => {
    const result = addEmails(emails, text, max);
    const message = describeEmailProblems(result, max);
    setEmails(result.emails);
    setTextValue(result.invalid.join(", "));
    setError(message);
    return { emails: result.emails, ok: message === "" };
  }, [emails, text, max]);

  const remove = useCallback(
    (email) => setEmails((list) => list.filter((item) => item !== email)),
    []
  );

  return { emails, text, error, setText, commit, remove };
}