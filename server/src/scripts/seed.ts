import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { env } from "../config/env";
import User from "../models/User";
import Category from "../models/Category";
import ProviderProfile from "../models/ProviderProfile";
import Service from "../models/Service";

const seedDatabase = async () => {
  try {
    console.log("Connecting to database...");
    await mongoose.connect(env.MONGODB_URI);
    console.log("Connected to MongoDB.");

    // 1. Clean existing data
    console.log("Cleaning existing database collections...");
    await User.deleteMany({});
    await Category.deleteMany({});
    await ProviderProfile.deleteMany({});
    await Service.deleteMany({});
    console.log("Collections cleaned.");

    // 2. Seed Categories
    console.log("Seeding categories...");
    const categoriesData = [
      {
        name: "Plumbing",
        slug: "plumbing",
        icon: "wrench",
        subcategories: [
          "Drain Cleaning",
          "Pipe Repair",
          "Water Heater",
          "Faucet Repair",
        ],
      },
      {
        name: "Electrical",
        slug: "electrical",
        icon: "zap",
        subcategories: [
          "Wiring",
          "Outlet Install",
          "Lighting",
          "Panel Upgrade",
        ],
      },
      {
        name: "Cleaning",
        slug: "cleaning",
        icon: "sparkles",
        subcategories: [
          "Deep Clean",
          "Regular Clean",
          "Move In/Out",
          "Carpet Clean",
        ],
      },
    ];

    const seededCategories = await Category.insertMany(categoriesData);
    console.log(`Seeded ${seededCategories.length} categories.`);

    const plumbingCategory = seededCategories.find(
      (c) => c.slug === "plumbing",
    )!;

    // 3. Seed Users
    console.log("Seeding users...");
    const passwordHash = await bcrypt.hash("Password123!", 10);

    const usersData = [
      {
        name: "Admin User",
        email: "admin@localserve.com",
        passwordHash,
        role: "admin",
        phone: "+15550001111",
        isVerified: true,
        isActive: true,
      },
      {
        name: "John Customer",
        email: "customer@localserve.com",
        passwordHash,
        role: "customer",
        phone: "+15550002222",
        isVerified: true,
        isActive: true,
      },
      {
        name: "Bob Provider",
        email: "provider@localserve.com",
        passwordHash,
        role: "provider",
        phone: "+15550003333",
        isVerified: true,
        isActive: true,
      },
    ];

    const seededUsers = await User.insertMany(usersData);
    console.log(`Seeded ${seededUsers.length} users.`);

    const providerUser = seededUsers.find((u) => u.role === "provider")!;

    // 4. Seed ProviderProfile
    console.log("Seeding provider profile...");
    const providerProfile = await ProviderProfile.create({
      userId: providerUser._id,
      bio: "Professional plumbing services with over 10 years of experience. Quick, clean, and reliable.",
      location: {
        type: "Point",
        coordinates: [-122.4194, 37.7749], // San Francisco coordinates
      },
      serviceRadius: 15, // 15 km radius
      isApproved: true,
      isAvailable: true,
      avgRating: 4.8,
      reviewCount: 12,
    });
    console.log("Seeded provider profile.");

    // 5. Seed Service
    console.log("Seeding service...");
    await Service.create({
      providerId: providerProfile._id,
      title: "Emergency Pipe Leak Repair",
      description:
        "Fast fix for any broken pipes, leaking faucets, or drainage issues. Guaranteed same-day service.",
      categoryId: plumbingCategory._id,
      subcategory: "Pipe Repair",
      pricingType: "hourly",
      price: 85, // $85 per hour
      images: ["https://images.unsplash.com/photo-1581094288338-2314dddb7eed"],
      isActive: true,
    });
    console.log("Seeded service.");

    console.log("Database seeded successfully! 🎉");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
