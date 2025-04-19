// app/api/user/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import connectToDB from '@/lib/db';
import User from '@/models/User';

// Zod validation schema (alternative to express-validator)
const registerSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(5, 'Password must be at least 5 characters long'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid phone number'),
  region: z.string().min(3, 'Region must be at least 3 characters long'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ errors: parsed.error.format() }, { status: 400 });
    }

    const { name, email, password, phone, region } = parsed.data;

    await connectToDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
    }

    // Hash the password
    const saltRounds = parseInt(process.env.SALT_ROUNDS || '10');
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      region: region.toUpperCase(),
    });

    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
  } catch (error: any) {
    console.error('Error in user registration:', error.message);
    return NextResponse.json(
      { error: 'Internal Server Error in registering user' },
      { status: 500 }
    );
  }
}
