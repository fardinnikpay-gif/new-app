// Editable hero content. Replace image.src with real photos later.
export const HERO_IMAGE_SIZE = { width: 1600, height: 900 };

export const heroSlides = [
  {
    id: "new-season",
    eyebrow: "New season",
    title: "Dressed for what comes next",
    subtitle: "Clean cuts and quiet colour. Discover the pieces everyone will be wearing.",
    cta: { label: "Shop new arrivals", to: "/shop?sort=newest" },
    image: { src: "/placeholders/hero-1.svg", alt: "New season collection" },
  },
  {
    id: "menswear",
    eyebrow: "Menswear",
    title: "Everyday essentials, elevated",
    subtitle: "Well-made basics built to be worn on repeat.",
    cta: { label: "Shop men", to: "/shop?category=men" },
    image: { src: "/placeholders/hero-2.svg", alt: "Menswear essentials" },
  },
  {
    id: "sale",
    eyebrow: "Limited time",
    title: "The season's best, now reduced",
    subtitle: "Selected styles at special prices while stock lasts.",
    cta: { label: "Shop sale", to: "/shop?onSale=true" },
    image: { src: "/placeholders/hero-3.svg", alt: "Selected styles on sale" },
  },
];