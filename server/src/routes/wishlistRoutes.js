import { Router } from "express";
import * as wishlistController from "../controllers/wishlistController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.use(protect);

router.get("/", wishlistController.getWishlist);
router.post("/:productId", wishlistController.toggleWishlist);
router.delete("/", wishlistController.clearWishlist);

export default router;