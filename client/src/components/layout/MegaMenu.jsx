import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { DURATION, EASE } from "../../animations/variants";
import { shopUrl } from "../../utils/navigation";
import Container from "../ui/Container";

const MAX_BRANDS = 6;
const toBrandName = (brand) => (typeof brand === "string" ? brand : brand?.name);

const HEADING = "mb-3 text-sm font-medium uppercase tracking-widest text-neutral-500";
const LINK = "inline-flex min-h-9 items-center hover:text-primary";

// props: { item (NAV_CATEGORIES entry), brands[], onNavigate } | the panel is positioned under the Header
export default function MegaMenu({ item, brands, onNavigate }) {
  const brandNames = brands.map(toBrandName).filter(Boolean).slice(0, MAX_BRANDS);

  return (
    <motion.div
      id="mega-menu"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: DURATION.fast, ease: EASE.out }}
      className="absolute inset-x-0 top-full border-t border-line bg-surface text-ink shadow-lift"
    >
      <Container className="grid grid-cols-12 gap-8 py-8">
        <nav aria-label={`${item.label} categories`} className="col-span-3">
          <h2 className={HEADING}>Shop {item.label}</h2>
          <ul>
            {item.links.map((link) => (
              <li key={link.label}>
                <Link to={shopUrl(link.params)} onClick={onNavigate} className={LINK}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {brandNames.length > 0 && (
          <nav aria-label="Brands" className="col-span-3">
            <h2 className={HEADING}>Brands</h2>
            <ul>
              {brandNames.map((brand) => (
                <li key={brand}>
                  <Link
                    to={shopUrl({ category: item.category, brand })}
                    onClick={onNavigate}
                    className={LINK}
                  >
                    {brand}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <Link
          to={shopUrl(item.promo.params)}
          onClick={onNavigate}
          className={`group relative overflow-hidden rounded-lg ${brandNames.length > 0 ? "col-span-6" : "col-span-9"}`}
        >
          <img
            src={item.promo.image}
            alt=""
            width="1600"
            height="900"
            loading="lazy"
            className="aspect-[16/7] w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span className="absolute inset-0 bg-ink/30" aria-hidden="true" />
          <span className="absolute bottom-4 left-4 text-2xl font-light text-surface">{item.promo.title}</span>
        </Link>
      </Container>
    </motion.div>
  );
}