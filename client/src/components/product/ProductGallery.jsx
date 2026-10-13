import useMediaQuery from "../../hooks/useMediaQuery";
import { PRODUCT_IMAGE_FALLBACK } from "../../data/productContent";
import GalleryViewer from "./GalleryViewer";
import GallerySlider from "./GallerySlider";

const TABLET_UP_QUERY = "(min-width: 768px)";
const DESKTOP_QUERY = "(min-width: 1024px)";

export default function ProductGallery({ images, title }) {
  const isTabletUp = useMediaQuery(TABLET_UP_QUERY);
  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  const list = images?.length ? images : [{ url: PRODUCT_IMAGE_FALLBACK }];

  if (!isTabletUp) return <GallerySlider images={list} title={title} />;
  return <GalleryViewer images={list} title={title} vertical={isDesktop} />;
}