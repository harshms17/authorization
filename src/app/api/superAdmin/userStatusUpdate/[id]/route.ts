import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { checkSuperAdmin } from "@/lib/checkSuperAdmin";
import { z } from "zod";

const StatusSchema = z.object({
  status: z.string().min(1, "Status is required"),
});

// Use a function to handle the context
export async function PATCH(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const isSuperAdmin = await checkSuperAdmin(req);

  if (!isSuperAdmin) {
    return new Response(
      JSON.stringify({ error: "Access denied. Not a super admin." }),
      { status: 403 }
    );
  }

  const { params } = context;

  // Await params to ensure it's ready to use
  const { id } = await Promise.resolve(params);

  if (!id) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    await dbConnect();

    const body = await req.json();
    const parsed = StatusSchema.safeParse(body);

    if (!parsed.success) {
      const errorMessages = parsed.error.issues.map((issue) => issue.message);
      return NextResponse.json({ errors: errorMessages }, { status: 400 });
    }

    const updatedUser = await User.findByIdAndUpdate(id, {
      status: parsed.data.status,
    });

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
