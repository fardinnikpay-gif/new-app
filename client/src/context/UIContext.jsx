import { UIContext } from "./UIContextObject";
import { useMemo, useReducer } from "react";const CLOSED = { searchOpen: false, megaMenuOpen: false, mobileMenuOpen: false };

// Only one panel is open at a time: opening one closes the others.
function reducer(state, action) {
  switch (action.type) {
    case "open":
      return state[action.panel] ? state : { ...CLOSED, [action.panel]: true };
    case "close":
      return state[action.panel] ? { ...state, [action.panel]: false } : state;
    case "closeAll":
      return Object.values(state).some(Boolean) ? CLOSED : state;
    default:
      return state;
  }
}

export function UIProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, CLOSED);

  const actions = useMemo(
    () => ({
      openSearch: () => dispatch({ type: "open", panel: "searchOpen" }),
      closeSearch: () => dispatch({ type: "close", panel: "searchOpen" }),
      openMegaMenu: () => dispatch({ type: "open", panel: "megaMenuOpen" }),
      closeMegaMenu: () => dispatch({ type: "close", panel: "megaMenuOpen" }),
      openMobileMenu: () => dispatch({ type: "open", panel: "mobileMenuOpen" }),
      closeMobileMenu: () => dispatch({ type: "close", panel: "mobileMenuOpen" }),
      closeAll: () => dispatch({ type: "closeAll" }),
    }),
    []
  );

  const value = useMemo(() => ({ ...state, ...actions }), [state, actions]);

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}
