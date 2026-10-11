import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true }); // mobile address bar resize must not refresh triggers

const REFRESH_DELAY_SECONDS = 0.1;
let refreshCall = null;

// refreshScrollTrigger() | call after data or images load; several calls in a row become one refresh
export function refreshScrollTrigger() {
  refreshCall?.kill();
  refreshCall = gsap.delayedCall(REFRESH_DELAY_SECONDS, () => ScrollTrigger.refresh());
}

export { gsap, ScrollTrigger };