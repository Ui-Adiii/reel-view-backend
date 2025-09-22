import express from 'express';
import { authUserMiddleware } from '../middlewares/auth.middleware.js';
import { getFoodPartnerById } from '../controllers/food-partner.controller.js';

const router = express.Router();

router.get("/:id",authUserMiddleware,getFoodPartnerById)

export default router;