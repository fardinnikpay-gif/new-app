const CHUNK_ERROR_PATTERN =
  /dynamically imported module|Loading chunk|Importing a module script failed|error loading dynamically/i;

export const isChunkLoadError = (error) =>
  CHUNK_ERROR_PATTERN.test(error?.message ?? "");