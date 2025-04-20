import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { checkSuperAdmin } from "@/lib/checkSuperAdmin";
import { z } from "zod";
import { sendMail } from "@/lib/sendMail";

const StatusSchema = z.object({
  status: z.string().min(1, "Status is required"),
});

// Use a function to handle the context
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const isSuperAdmin = await checkSuperAdmin(req);

  if (!isSuperAdmin) {
    return new Response(
      JSON.stringify({ error: "Access denied. Not a super admin." }),
      { status: 403 }
    );
  }

  // Await params to ensure it's ready to use
  const { id } = await context.params;
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
    
    const { email, status } = updatedUser;
    const subject = `Status Update Notification`;
    const message =
      status === "Approved" || status === "Declined"
        ? `Your request has been ${status}.`
        : `You are blocked by the Founder.`;
    await sendMail({ to: email, subject, message })
      .then(() => console.log("Email sent successfully"))
      .catch((error) => console.error("Error sending email:", error));

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
