import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { getUserFromToken } from '@/lib/fetchUser';
import { checkAdmin } from '@/lib/checkAdmin';

export async function GET(req: NextRequest) {
  const userResult = await getUserFromToken(req);
  if ('status' in userResult) return userResult;

  try {
    await dbConnect();

    const admin = await User.findById(userResult.id);
    if (!admin) {
      return NextResponse.json({ error: 'Admin user not found' }, { status: 404 });
    }

    const isAdmin = await checkAdmin(admin);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Access denied. Not an admin.' }, { status: 403 });
    }

    const users = await User.find({ region: admin.region, _id: { $ne: admin.id } }).select('-password -__v');

    return NextResponse.json(users, { status: 200 });
  } catch (error: any) {
    console.error('Error in getUsers route:', error.message);
    return NextResponse.json({ error: 'Internal Server Error in fetching users' }, { status: 500 });
  }
}
