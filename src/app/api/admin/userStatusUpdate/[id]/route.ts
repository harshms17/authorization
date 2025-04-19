import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { getUserFromToken } from "@/lib/fetchUser";
import { checkAdmin } from "@/lib/checkAdmin";
import { z } from "zod";
import mongoose from "mongoose";

const StatusSchema = z.object({
  status: z.string().min(1, "Status is required"),
});

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid or missing User ID" }, { status: 400 });
  }

  const userData = await getUserFromToken(req);
  if (!userData || !("id" in userData)) {
    return NextResponse.json({ error: "Invalid or missing token" }, { status: 401 });
  }

  await dbConnect();

  const admin = await User.findById(userData.id);
  if (!admin) {
    return NextResponse.json({ error: "Admin user not found" }, { status: 404 });
  }

  const isAdmin = await checkAdmin(admin);
  if (!isAdmin) {
    return NextResponse.json({ error: "Access denied. Not an admin." }, { status: 403 });
  }

  try {
    const body = await req.json();
    const parsed = StatusSchema.safeParse(body);

    if (!parsed.success) {
      const errorMessages = parsed.error.issues.map((issue) => issue.message);
      return NextResponse.json({ errors: errorMessages }, { status: 400 });
    }

    const updatedUser = await User.findByIdAndUpdate(id, { status: parsed.data.status });

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "User status updated successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error updating user status:", (error as Error).message);
    return NextResponse.json(
      { error: "Internal Server Error in updating user status" },
      { status: 500 }
    );
  }
}
