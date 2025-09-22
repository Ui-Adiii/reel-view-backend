import FoodPartner from "../models/foodpartner.model.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const authFoodPartnerMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized Access"
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const foodPartner = await FoodPartner.findById(decoded.id);
        
        if (!foodPartner) {
            return res.status(404).json({
                success: false,
                message: "Food Partner not found"
            });
        }
        req.foodPartner = foodPartner;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: error.message
        });
    }
}
const authUserMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.json({
                success: false,
                message: "Unauthorized Access"
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: error.message
        });
    }
}
export { authFoodPartnerMiddleware,authUserMiddleware};