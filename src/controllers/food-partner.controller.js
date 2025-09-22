import Food from "../models/food.model.js";
import FoodPartner from "../models/foodpartner.model.js";

const getFoodPartnerById = async (req, res) => {
  try {
    const { id } = req.params;
    const foodPartner = await FoodPartner.findById(id);
    if (!foodPartner) {
      return res.status(404).json({
        success: false,
        message: "Food Partner not found",
      });
    }

    const foodItems = await Food.find({ foodPartner: id });
    

    return res.status(200).json({
      success: true,
      message: "Food Partner found",
      foodPartner:{
        ...foodPartner.toObject(),
        foodItems
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { getFoodPartnerById };
