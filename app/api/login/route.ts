// app/api/login/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  const { email, username } = await req.json()

  if (!email || !username) {
    return NextResponse.json({ error: 'Email and username are required' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { email } })

  if (!user || user.name !== username) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const response = NextResponse.json({ message: 'Login successful' })

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
