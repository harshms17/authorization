import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { getUserFromToken } from '@/lib/fetchUser';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // Extract user ID from token
    const { id } = await getUserFromToken(req) as { id: string };

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.status === 'Registered' || user.status === 'Declined') {
      user.status = 'Pending';
      await user.save();
      return NextResponse.json({ message: 'Request sent successfully' }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'You have already requested for admin approval' }, { status: 400 });
    }
  } catch (error: unknown) {
    console.error((error as Error).message);
    return NextResponse.json({ message: 'Internal Server Error in sending request' }, { status: 500 });
  }
}
