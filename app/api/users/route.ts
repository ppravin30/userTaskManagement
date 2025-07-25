// app/api/users/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  const { email, username } = await req.json()

  if (!email || !username) {
    return NextResponse.json({ error: 'Email and username required' }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ error: 'Email already exists' }, { status: 400 })
  }

  const user = await prisma.user.create({
    data: {
      email,
      name: username,
    },
  })

  const response = NextResponse.json({ message: 'User created' })
  response.cookies.set(
    'user',
    encodeURIComponent(JSON.stringify({ email: user.email, name: user.name })),
    {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24,
    }
  )

  return response
}
