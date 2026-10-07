import { Router } from "express";
import { getCategories, updateCategory } from "../controllers/categoryController.js";
import { protect, adminOnly } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { uploadImage } from "../middleware/upload.js";
import { idParamSchema } from "../validators/commonValidator.js";

const router = Router();

router.get("/", getCategories);

// protect runs before the upload so unauthenticated or cross-site requests are never parsed
router.put("/:id", protect, adminOnly, validate(idParamSchema, "params"), uploadImage, updateCategory);

export default router;