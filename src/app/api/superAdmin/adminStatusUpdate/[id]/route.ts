import { NextRequest, NextResponse } from "next/server";
import { checkSuperAdmin } from "@/lib/checkSuperAdmin";
import User from "@/models/User";
import dbConnect from "@/lib/db"; // Ensures MongoDB connection

export async function PATCH(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { params } = context;

  // Await params to ensure it's ready to use
  const { id } = await Promise.resolve(params);

  const isSuperAdmin = await checkSuperAdmin(req);

  if (!isSuperAdmin) {
    return new Response(
      JSON.stringify({ error: "Access denied. Not a super admin." }),
      { status: 403 }
    );
  }

  try {
    await dbConnect(); // Ensure MongoDB connection

    const body = await req.json();

    // Validate that isAdmin is a boolean
    if (typeof body.isAdmin !== "boolean") {
      return NextResponse.json(
        { error: "isAdmin must be a boolean" },
        { status: 400 }
      );
    }

    // Update the user's isAdmin status
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { isAdmin: body.isAdmin },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Admin status updated successfully",
      user: updatedUser,
    });
  } catch (error: unknown) {
    console.error("Error updating admin status:", (error as Error).message);
    return NextResponse.json(
      { error: "Internal Server Error in updating Admin status" },
      { status: 500 }
    );
  }
}
