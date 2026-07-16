import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User";
import ProviderProfile from "../models/ProviderProfile";

async function run() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("Connected.");

    // Clean existing test provider
    await User.deleteMany({ email: "provider@localserve.test" });
    const existingProfile = await ProviderProfile.findOne();
    if (existingProfile) {
      await ProviderProfile.deleteMany({ userId: existingProfile.userId });
    }

    // Create User
    const passwordHash = await bcrypt.hash("Provider123!", 10);
    const user = await User.create({
      name: "John Plumber",
      email: "provider@localserve.test",
      passwordHash,
      role: "provider",
      isVerified: true,
      isActive: true,
    });

    // Create ProviderProfile
    const profile = await ProviderProfile.create({
      userId: user._id,
      bio: "Expert plumbing services. Available for emergency repairs and pipe installations. Over 10 years of experience.",
      location: {
        type: "Point",
        coordinates: [72.4701297, 30.9679923], // EXACT coordinates as browser geolocation
      },
      serviceRadius: 20, // 20 km
      isApproved: true,
      isAvailable: true,
      avgRating: 4.8,
      reviewCount: 15,
      portfolioImages: [],
    });

    console.log("-----------------------------------------");
    console.log("Provider seeding complete!");
    console.log("User:", user.name, `(${user.email})`);
    console.log("Profile created:", profile._id);
    console.log("-----------------------------------------");
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    await mongoose.disconnect();
  }
}

run();
