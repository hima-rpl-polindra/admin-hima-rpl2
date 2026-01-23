import { mongooseConnect } from "@/lib/mongoose";
import { Profile } from "@/models/Profile";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  await mongooseConnect();

  const { email, password } = req.body;

  // Basic input validation
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    // Check if the user already exists
    const existingUser = await Profile.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = await Profile.create({ email, password: hashedPassword });

    res
      .status(201)
      .json({ message: "User Created Successfully", user: newUser });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: "Server error" });
  }
}
