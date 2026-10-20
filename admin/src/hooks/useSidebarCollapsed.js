import { useCallback, useEffect, useState } from "react";
import { SIDEBAR_STORAGE_KEY } from "../utils/constants";

const readStored = () => {
  try {
    return localStorage.getItem(SIDEBAR_STORAGE_KEY) === "1";
  } catch {
    return false; // Storage blocked (private mode / policy).
  }
};

export default function useSidebarCollapsed() {
  const [collapsed, setCollapsed] = useState(readStored);

  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, collapsed ? "1" : "0");
    } catch {
      // Ignore: the preference just won't persist.
    }
  }, [collapsed]);

  const toggle = useCallback(() => setCollapsed((value) => !value), []);

  return [collapsed, toggle];
}