export function isMobileDevice() {
  return window.matchMedia("pointer: coarse").matches;
}