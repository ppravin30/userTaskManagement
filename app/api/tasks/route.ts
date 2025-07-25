// app/api/tasks/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    
    const { task, dueDate, category }  = await req.json();
    // // const { task, dueDate, category } = body;
    // const {data} = body;

    if (!task || !dueDate || !category) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const newTask = await prisma.task.create({
      data: {
        name: task,
        dueDate: new Date(dueDate),
        category,
        user: {
          connect: { id: 'user-id-placeholder' }, // Replace this with actual user ID from auth
        },
      },
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error('Task creation failed:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
