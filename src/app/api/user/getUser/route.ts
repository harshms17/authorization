import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/User';
import dbConnect from '@/lib/db';
import { getUserFromToken } from '@/lib/fetchUser';

export async function GET(req: NextRequest) {
  const userResult = await getUserFromToken(req);

  // If it's a response (like a 401), return it directly
  if ('status' in userResult) return userResult;

  try {
    await dbConnect();

    const user = await User.findById(userResult.id).select('-password -__v');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error: any) {
    console.error('Error in getUser route:', error.message);
    return NextResponse.json({ error: 'Internal Server Error in getting user' }, { status: 500 });
  }
}
