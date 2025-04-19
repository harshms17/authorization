import { NextRequest, NextResponse } from "next/server";
import { checkSuperAdmin } from "@/lib/checkSuperAdmin";
import User from "@/models/User";
import "@/lib/db"; // Ensure DB is connected

export async function GET(req: NextRequest) {
  const isSuperAdmin = await checkSuperAdmin(req);

  if (!isSuperAdmin) {
    return new Response(
      JSON.stringify({ error: "Access denied. Not a super admin." }),
      { status: 403 }
    );
  }

  try {
    const users = await User.find({ isAdmin: false }).select("-password -__v");
    return NextResponse.json(users);
  } catch (error: unknown) {
    console.error((error as Error).message);
    return NextResponse.json(
      { error: "Internal Server Error in getting all users" },
      { status: 500 }
    );
  }
}
