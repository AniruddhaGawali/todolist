import { NextRequest, NextResponse } from 'next/server';
import db from '@/db';

export async function GET() {
  try {
    const data = await db.todos.findMany();

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, priority, dueDate } = body;

    const data = await db.todos.create({
      data: { title, priority, dueDate },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await db.todos.update({
      where: { id: body.id },
      data: {
        title: body.title,
        priority: body.priority,
        dueDate: body.dueDate,
        isDone: body.isDone,
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    await db.todos.delete({ where: { id: id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing DELETE request:', error);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
