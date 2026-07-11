import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { allowRoles } from "../middlewares/role.middleware";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  resetPasswordByAdmin,
  requestPasswordResetByUser,
  resetPasswordByUser,
} from "../controllers/user.controller";

const router = Router();

router.post("/forgot-password", requestPasswordResetByUser);
router.patch("/reset-password", resetPasswordByUser);

router.use(authMiddleware);
router.use(allowRoles("admin"));

router.get("/", getAllUsers);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.patch("/:id/reset-password", resetPasswordByAdmin);

export default router;
