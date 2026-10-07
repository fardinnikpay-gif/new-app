import { Router } from "express";
import {
  getProducts,
  getProductBySlug,
  getRelatedProducts,
  getFeaturedProducts,
  getNewArrivals,
  getBrands,
} from "../controllers/productController.js";
import { validate } from "../middleware/validate.js";
import {
  productQuerySchema,
  homeListQuerySchema,
  slugParamSchema,
} from "../validators/productValidator.js";

const router = Router();

router.get("/", validate(productQuerySchema, "query"), getProducts);

// Fixed paths must come BEFORE "/:slug", or "featured" would be read as a slug
router.get("/featured", validate(homeListQuerySchema, "query"), getFeaturedProducts);
router.get("/new-arrivals", validate(homeListQuerySchema, "query"), getNewArrivals);
router.get("/brands", getBrands);

router.get("/:slug", validate(slugParamSchema, "params"), getProductBySlug);
router.get("/:slug/related", validate(slugParamSchema, "params"), getRelatedProducts);

export default router;