import { NextRequest, NextResponse } from "next/server";
import { z } from "zod"; // Import Zod
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db"; // MongoDB connection logic
import User from "@/models/User"; // User model

// Define the Zod schema for validation
const loginSchema = z.object({
  email: z.string().email("Invalid email address"), // Validate email format
  password: z.string().min(1, "Password is required"), // Validate that password is not empty
});

export async function POST(req: NextRequest) {
  try {
    // Parse and validate the body with Zod
    const parsedData = loginSchema.parse(await req.json()); // Parse the JSON body

    const { email, password } = parsedData;

    // Connect to the database
    await dbConnect();

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 400 }
      );
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 400 }
      );
    }

    if(!user.isAdmin) {
        return NextResponse.json(
            { error: "You are not an admin" },
            { status: 400 }
        );
    }

    // Create and assign a token
    const token = jwt.sign({ user: { id: user._id } }, process.env.JWT_SECRET!);

    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Return validation errors if Zod validation fails
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }

    console.error((error as Error).message);
    return NextResponse.json(
      { message: "Internal Server Error in logging in user" },
      { status: 500 }
    );
  }
}
