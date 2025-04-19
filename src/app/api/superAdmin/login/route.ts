import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (
      email === process.env.SUPER_ADMIN_EMAIL &&
      password === process.env.SUPER_ADMIN_PASSWORD
    ) {
      const token = jwt.sign(
        {
          id: process.env.SUPER_ADMIN_ID,
          pass: process.env.SUPER_ADMIN_PASSWORD,
        },
        process.env.JWT_SECRET as string
      );

      return NextResponse.json({ token });
    }

    return NextResponse.json(
      { error: 'Access denied. Not a super admin.' },
      { status: 403 }
    );
  } catch (error: unknown) {
    console.error((error as Error).message);
    return NextResponse.json(
      { error: 'Internal Server Error in logging in Super Admin' },
      { status: 500 }
    );
  }
}
