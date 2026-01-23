const { Schema, models, model } = require("mongoose");
const bcrypt = require("bcryptjs");

const ProfileSchema = new Schema(
  {
    email: { type: String },
    password: { type: String },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
  },
);

// Function to create a profile by hashing the password
const createProfile = async (email, plainPassword) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);

    const profile = new Profile({
      email,
      password: hashedPassword,
    });

    await profile.save();
    return profile;
  } catch (error) {
    throw new Error("Failed to create profile: " + error.message);
  }
};

// Export the Profile model and the function to create profile
export const Profile =
  models.Profile || model("Profile", ProfileSchema, "admin");
export { createProfile };
