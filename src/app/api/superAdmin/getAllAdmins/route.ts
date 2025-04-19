import { NextRequest, NextResponse } from "next/server";
import { checkSuperAdmin } from "@/lib/checkSuperAdmin";
import User from "@/models/User";
import "@/lib/db"; // ensures DB connection is established

export async function GET(req: NextRequest) {
  const isSuperAdmin = await checkSuperAdmin(req);

  if (!isSuperAdmin) {
    return new Response(
      JSON.stringify({ error: "Access denied. Not a super admin." }),
      { status: 403 }
    );
  }

  try {
    const users = await User.find({ isAdmin: true }).select("-password -__v");
    return NextResponse.json(users);
  } catch (error: unknown) {
    console.error((error as Error).message);
    return NextResponse.json(
      { error: "Internal Server Error in getting all users" },
      { status: 500 }
    );
  }
}
