import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Category from "../models/Category.js";
import User from "../models/User.js";

const categories = [
  {
    name: "Plumbing",
    slug: "plumbing",
    subcategories: ["Drain Cleaning", "Pipe Repair", "Water Heater", "Toilet Repair"],
  },
  {
    name: "Electrical",
    slug: "electrical",
    subcategories: ["Lighting", "Outlets & Switches", "Panel Upgrades", "Ceiling Fan Installation"],
  },
  {
    name: "Cleaning",
    slug: "cleaning",
    subcategories: ["House Cleaning", "Carpet Cleaning", "Window Cleaning", "Deep Cleaning"],
  },
  {
    name: "Tutoring",
    slug: "tutoring",
    subcategories: ["Math", "Science", "Languages", "Test Prep"],
  },
  {
    name: "Beauty",
    slug: "beauty",
    subcategories: ["Hair Styling", "Makeup", "Nail Care", "Spa Services"],
  },
  {
    name: "Moving",
    slug: "moving",
    subcategories: ["Residential Moving", "Packing Services", "Furniture Moving", "Long Distance"],
  },
  {
    name: "Gardening",
    slug: "gardening",
    subcategories: ["Lawn Mowing", "Landscape Design", "Tree Trimming", "Planting"],
  },
  {
    name: "Appliance Repair",
    slug: "appliance-repair",
    subcategories: ["Refrigerator", "Washing Machine", "Oven", "Dishwasher"],
  },
  {
    name: "Painting",
    slug: "painting",
    subcategories: ["Interior Painting", "Exterior Painting", "Cabinet Refinishing", "Wallpaper Removal"],
  },
  {
    name: "Pet Care",
    slug: "pet-care",
    subcategories: ["Dog Walking", "Pet Sitting", "Grooming", "Training"],
  },
];

async function seed() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("Connected.");

    // Clear existing
    await Category.deleteMany({});
    await User.deleteMany({ email: "admin@localserve.test" });

    // Seed Categories
    console.log("Seeding categories...");
    await Category.insertMany(categories);

    // Seed Admin
    console.log("Seeding admin user...");
    const passwordHash = await bcrypt.hash("Admin123!", 10);
    const admin = await User.create({
      name: "Admin User",
      email: "admin@localserve.test",
      passwordHash,
      role: "admin",
      isVerified: true,
    });

    console.log("-----------------------------------------");
    console.log("Seeding complete!");
    console.log("Admin User Created:");
    console.log("Email: admin@localserve.test");
    console.log("Password: Admin123!");
    console.log("-----------------------------------------");
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

seed();
