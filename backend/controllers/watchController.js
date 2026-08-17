import mongoose from "mongoose";
import path from "path";
import fs from "fs";
import Watch from "../models/watchModel.js";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const API_BASE="http://localhost:5000";
export async function createWatch(req, res) {
  try {
    const { name, description, price, category, brandName } = req.body;

    let image = req.body.image;

    // Upload image to Cloudinary
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "smartshop/watches",
      });

      image = result.secure_url;
    }

    if (!name || !price || !image || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const doc = new Watch({
      _id: new mongoose.Types.ObjectId(),
      name,
      description,
      price,
      category,
      brandName,
      image,
    });

    const saved = await doc.save();

    return res.status(201).json({
      success: true,
      message: "Watch created",
      data: saved,
    });
  } catch (err) {
    console.error("CreateWatch error:", err);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}
export async function getWatches(req,res){
    try {
        const {category,sort="-createdAt",page=1,limit=12}=req.query;
        const filter={};
        if (typeof category === "string") {
      const cat = category.trim().toLowerCase();
      if (cat === "men" || cat === "women") filter.category = cat;
    }

    const pg = Math.max(1, parseInt(page, 10) || 1);
    const lim = Math.min(200, parseInt(limit, 10) || 12);
    const skip = (pg - 1) * lim;

    const total = await Watch.countDocuments(filter);
    const items =await Watch.find(filter).sort(sort).skip(skip).lean();
    return res.json({
        success:true,
        total,
        page:pg,
        limit:lim,
        items
    });
    } catch (err) {
        console.error("getWatch error: ",err);
        return res.status(500).json({
            success:false,
            message:"Server Error"
        });
    }
}
export async function deleteWatch(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "id is required",
      });
    }

    const w = await Watch.findById(id);

    if (!w) {
      return res.status(404).json({
        success: false,
        message: "Watch not found",
      });
    }

    // Delete image from Cloudinary
    if (
      w.image &&
      typeof w.image === "string" &&
      w.image.includes("res.cloudinary.com")
    ) {
      try {
        const parts = w.image.split("/upload/")[1];

        if (parts) {
          const publicIdWithVersion = parts
            .replace(/^v\d+\//, "")
            .replace(/\.[^/.]+$/, "");

          await cloudinary.uploader.destroy(publicIdWithVersion);
        }
      } catch (cloudinaryError) {
        console.warn(
          "Cloudinary image delete failed:",
          cloudinaryError?.message || cloudinaryError
        );
      }
    }

    await Watch.findByIdAndDelete(id);

    return res.json({
      success: true,
      message: "Watch deleted successfully",
    });
  } catch (err) {
    console.error("deleteWatch error:", err);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}
export async function getWatchByBrand(req,res) {
    try {
         const brandName=req.params.brandName;
        const items = await Watch.find({ brandName }).sort({ createdAt: -1 }).lean();
         return res.json({success:true,items})
    } catch (err) {
         console.error("getWatchByBrand error: ",err);
        return res.status(500).json({
            success:false,
            message:"Server Error"
        }); 
    }
}