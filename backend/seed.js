// seed.js — Place in /backend folder
// Run once: node seed.js

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Use raw collection to bypass model hooks entirely
    const db = mongoose.connection.db;
    const col = db.collection("users");

    // Clear existing users
    await col.deleteMany({});
    console.log("🗑  Cleared existing users");

    // Hash passwords manually
    const users = [
      {
        name:      "Super Admin",
        email:     "admin@hospital.com",
        password:  await bcrypt.hash("admin123", 10),
        role:      "admin",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name:      "Dr. John Smith",
        email:     "doctor@hospital.com",
        password:  await bcrypt.hash("doctor123", 10),
        role:      "doctor",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name:      "Reception Staff",
        email:     "reception@hospital.com",
        password:  await bcrypt.hash("reception123", 10),
        role:      "receptionist",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await col.insertMany(users);

    console.log("\n🎉 Seed complete! Login credentials:\n");
    console.log("🛡️  Admin        → admin@hospital.com      / admin123");
    console.log("👨‍⚕️  Doctor       → doctor@hospital.com     / doctor123");
    console.log("🗂️  Receptionist → reception@hospital.com  / reception123");
    console.log("\n⚠️  Change these passwords after first login!");

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  }
}

seed();