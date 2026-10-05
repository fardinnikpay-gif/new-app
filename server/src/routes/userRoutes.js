import { Router } from "express";
import * as userController from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { authLimiter } from "../middleware/rateLimiters.js";
import { idParamSchema } from "../validators/commonValidator.js";
import {
  updateProfileSchema,
  changePasswordSchema,
  createAddressSchema,
  updateAddressSchema,
} from "../validators/userValidator.js";

const router = Router();

router.use(protect); // every route here needs a signed-in user

router.put("/profile", validate(updateProfileSchema), userController.updateProfile);

// Guessing the current password is limited like logging in
router.put("/password", authLimiter, validate(changePasswordSchema), userController.changePassword);

router.post("/addresses", validate(createAddressSchema), userController.addAddress);
router.put(
  "/addresses/:id",
  validate(idParamSchema, "params"),
  validate(updateAddressSchema),
  userController.updateAddress
);
router.delete("/addresses/:id", validate(idParamSchema, "params"), userController.deleteAddress);

export default router;