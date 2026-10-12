import { motion } from "framer-motion";
import { fadeUp, stagger } from "../../animations/variants";
import ProductCard from "./ProductCard";
import ProductGridSkeleton, { GRID_CLASS } from "./ProductGridSkeleton";

const PRIORITY_COUNT = 4; // first desktop row loads eagerly

// props: { products, loading } | an empty list renders nothing: the page shows its own EmptyState
export default function ProductGrid({ products = [], loading = false }) {
  if (loading) return <ProductGridSkeleton />;
  if (products.length === 0) return null;

  return (
    <motion.ul variants={stagger} initial="hidden" animate="visible" className={GRID_CLASS}>
      {products.map((product, index) => (
        <motion.li key={product._id} variants={fadeUp}>
          <ProductCard product={product} priority={index < PRIORITY_COUNT} />
        </motion.li>
      ))}
    </motion.ul>
  );
}