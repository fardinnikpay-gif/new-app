import { useCallback, useMemo, useState } from "react";

const NO_IMAGES = [];

// Image state of the product form, kept outside react-hook-form because it holds File objects.
// initialImages: [{ url, publicId }] from the server (empty when creating).
export default function useProductImages(initialImages = NO_IMAGES) {
  const [removedIds, setRemovedIds] = useState([]);
  const [files, setFiles] = useState([]);

  // Server images that are still kept.
  const existing = useMemo(
    () => initialImages.filter((image) => !removedIds.includes(image.publicId)),
    [initialImages, removedIds]
  );

  const addFiles = useCallback((added) => setFiles((current) => [...current, ...added]), []);
  const removeExisting = useCallback(
    (publicId) => setRemovedIds((ids) => [...ids, publicId]),
    []
  );
  const removeNew = useCallback(
    (file) => setFiles((current) => current.filter((item) => item !== file)),
    []
  );

  return {
    existing,
    files,
    removedIds,
    addFiles,
    removeExisting,
    removeNew,
    isDirty: files.length > 0 || removedIds.length > 0,
  };
}