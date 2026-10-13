import { useCallback, useState } from "react";

const STORAGE_KEY = "coupon_code";

const read = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) || "";
  } catch {
    return "";
  }
};

const write = (value) => {
  try {
    if (value) localStorage.setItem(STORAGE_KEY, value);
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // storage unavailable: the code simply won't persist
  }
};

// The applied coupon code, shared by Cart and Checkout via localStorage.
export default function useCouponCode() {
  const [code, setCodeState] = useState(read);

  const setCode = useCallback((value) => {
    write(value);
    setCodeState(value);
  }, []);

  return [code, setCode];
}