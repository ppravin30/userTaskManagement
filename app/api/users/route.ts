// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }

    const newUser = await prisma.user.create({
      data: {
        email,
        name: name || null,
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('User creation failed:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
