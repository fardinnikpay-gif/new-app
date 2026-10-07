import { Router } from "express";
import * as productController from "../controllers/productController.js";
import * as productAdminController from "../controllers/productAdminController.js";
import { protect, adminOnly } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { uploadImages } from "../middleware/upload.js";
import { createProductSchema, updateProductSchema } from "../validators/productValidator.js";

const router = Router();

// Public: static paths MUST come before /:slug
router.get("/", productController.getProducts);
router.get("/featured", productController.getFeaturedProducts);
router.get("/new-arrivals", productController.getNewArrivals);
router.get("/brands", productController.getBrands);
router.get("/:slug", productController.getProductBySlug);
router.get("/:slug/related", productController.getRelatedProducts);

// Admin: multer must run before validate (it is what fills req.body)
router.post(
  "/",
  protect,
  adminOnly,
  uploadImages,
  validate(createProductSchema),
  productAdminController.createProduct
);
router.put(
  "/:id",
  protect,
  adminOnly,
  uploadImages,
  validate(updateProductSchema),
  productAdminController.updateProduct
);
router.patch("/:id/toggle-active", protect, adminOnly, productAdminController.toggleActive);
router.delete("/:id", protect, adminOnly, productAdminController.deleteProduct);

export default router;