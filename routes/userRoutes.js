import express from "express";
/*import { register } from "../controllers/userController.js";*/
import {
  getAllUser,
  getUser,
  updateUser,
  deleteUser,
  filterUserByName,
  loginUser,
  register,
} from "../controllers/userController.js";
import  protect  from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/reg", register);
router.get("/get", protect, getAllUser);
router.get("/get/:id", getUser);
router.put("/update/:id", updateUser);
router.delete("/delete/:id", deleteUser);
router.get("/filter", filterUserByName);
router.post("/login", loginUser);

export default router;
