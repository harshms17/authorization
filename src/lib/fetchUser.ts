import jwt from 'jsonwebtoken';
import User from '@/models/User';
import dbConnect from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function getUserFromToken(req: NextRequest) {
  const token = req.headers.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Please login first' }, { status: 401 });
  }

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET!) as { user: { id: string } };

    await dbConnect();

    const user = await User.findById(data.user.id);
    if (!user) {
      return NextResponse.json({ error: 'Don\'t interrupt with the token' }, { status: 401 });
    }

    return { id: data.user.id };
  } catch (err: any) {
    console.error(err.message);
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
