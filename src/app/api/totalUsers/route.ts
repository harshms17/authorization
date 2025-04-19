// src/api/totalUsers/route.ts
import { NextResponse, NextRequest } from 'next/server';
import connectToDB from '@/lib/db';
import User from '@/models/User';

export async function GET(req: NextRequest) {
  try {
    await connectToDB(); // Connect to MongoDB
    const totalUsers = await User.countDocuments({});
    return NextResponse.json({ totalUsers });
  } catch (error) {
    console.error('Error fetching user counts:', error);
    return NextResponse.json(
      { error: 'Internal Server Error in getting user counts' },
      { status: 500 }
    );
  }
}
