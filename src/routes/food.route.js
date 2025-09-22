import express from "express";
import {
  authFoodPartnerMiddleware,
  authUserMiddleware,
} from "../middlewares/auth.middleware.js";
import {
  createFood,
  getFoodItems,
  getSaveFood,
  likeFood,
  saveFood,
} from "../controllers/food.controller.js";
import upload from "../middlewares/multer.middleware.js";
const router = express.Router();

router.get("/", getFoodItems);
router.post(
  "/add-food",
  authFoodPartnerMiddleware,
  upload.single("video"),
  createFood
);
router.post("/like", authUserMiddleware, likeFood);
router.post("/save", authUserMiddleware, saveFood);

router.get("/save", authUserMiddleware, getSaveFood);

export default router;
