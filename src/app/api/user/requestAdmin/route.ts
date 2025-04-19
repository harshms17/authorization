import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/fetchUser';
import User from '@/models/User';
import dbConnect from '@/lib/db';

export async function GET(req: NextRequest) {
  const userResult = await getUserFromToken(req);

  // If token is invalid, return the 401 response directly
  if ('status' in userResult) return userResult;

  try {
    await dbConnect();

    const user = await User.findById(userResult.id);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Already admin?
    if (user.isAdmin) {
      return NextResponse.json({ error: 'You are already an admin' }, { status: 400 });
    }

    // Not approved?
    if (user.status !== 'Approved') {
      return NextResponse.json({ error: 'You are not approved yet' }, { status: 400 });
    }

    user.isAdmin = true;
    await user.save();

    return NextResponse.json({ message: 'You are now an admin' }, { status: 200 });
  } catch (error: any) {
    console.error('Error in requestAdmin route:', error.message);
    return NextResponse.json({ error: 'Internal Server Error in requesting admin' }, { status: 500 });
  }
}
