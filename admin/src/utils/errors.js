// Browsers word a failed lazy-import differently (Chrome, Firefox, Safari): match all of them.
const CHUNK_ERROR_PATTERN =
  /dynamically imported module|importing a module script failed|ChunkLoadError|Loading chunk/i;

// True when a page file could not be loaded, typically because a new deploy replaced it
// while this tab was still open.
export const isChunkLoadError = (error) => CHUNK_ERROR_PATTERN.test(String(error?.message ?? ""));