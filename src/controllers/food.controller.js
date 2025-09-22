import Food from "../models/food.model.js";
import Like from "../models/likes.model.js";
import Save from "../models/saved.model.js";
import { uploadFile } from "../services/storage.service.js";
import { v4 as uuid } from "uuid";

const createFood = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || name === "") {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const { file } = req;
    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Video file is required",
      });
    }
    const fileUploadResult = await uploadFile(file.buffer, uuid());

    const food = await Food.create({
      name,
      description,
      video: fileUploadResult.url,
      foodPartner: req.foodPartner._id,
    });

    return res.status(201).json({
      success: true,
      message: "Food created successfully",
      food,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getFoodItems = async (req, res) => {
  try {
    const foodItems = await Food.find({});
    return res.status(200).json({
      success: true,
      message: "foodItems fetched successfully",
      foodItems,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const likeFood = async (req, res) => {
  try {
    const { foodId } = req.body;
    const { user } = req;
    if (!foodId) {
      return res.status(400).json({
        success: false,
        message: "Food ID is required",
      });
    }
    const isLike = await Like.findOne({ user: user._id, food: foodId });
    if (isLike) {
      await Like.deleteOne({
        user: user._id,
        food: foodId,
      });
      await Food.findByIdAndUpdate(foodId, {
        $inc: { likeCount: -1 },
      });
      return res.status(200).json({
        success: true,
        message: "Food unliked successfilly",
      });
    }

    const like = await Like.create({ user: req.user._id, food: foodId });
    await Food.findByIdAndUpdate(foodId, {
      $inc: { likeCount: 1 },
    });

    return res.status(201).json({
      success: true,
      message: "Food liked successfully",
      like,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const saveFood = async (req, res) => {
  try {
    const { foodId } = req.body;
    const { user } = req;
    if (!foodId) {
      return res.status(400).json({
        success: false,
        message: "Food ID is required",
      });
    }
    const iSsave = await Save.findOne({ user: user._id, food: foodId });
    if (iSsave) {
      await Save.deleteOne({
        user: user._id,
        food: foodId,
      });
      await Food.findByIdAndUpdate(foodId, {
        $inc: { saveCount: -1 },
      });
      return res.status(200).json({
        success: true,
        message: "Food unsaved successfully",
      });
    }

    const save = await Save.create({ user: req.user._id, food: foodId });
    await Food.findByIdAndUpdate(foodId, {
      $inc: { saveCount: 1 },
    });

    return res.status(201).json({
      success: true,
      message: "Food saved successfully",
      save,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


async function getSaveFood(req, res) {

   try {
     const user = req.user;
     const savedFoods = await Save.find({ user: user._id }).populate("food");
 
     if (!savedFoods || savedFoods.length === 0) {
         return res.json({success:false, message: "No saved foods found" });
     }
 
     res.status(200).json({
         success: true,
         message: "Saved foods retrieved successfully",
         savedFoods
     });
 
   } catch (error) {
     return res.status(500).json({success:false, message: error.message });
   }
}

export { createFood, getFoodItems, likeFood ,saveFood, getSaveFood };
