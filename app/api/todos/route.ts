// Simple local todo API for demo. For production, use a database.
import { NextRequest, NextResponse } from "next/server";

const todos: { id: number; text: string; done: boolean; userId: string }[] = [];

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");
  if (!userId)
    return NextResponse.json(
      { success: false, message: "Missing userId" },
      { status: 400 }
    );
  const userTodos = todos.filter((t) => t.userId === userId);
  return NextResponse.json({ success: true, todos: userTodos });
}

export async function POST(request: NextRequest) {
  const { text, userId } = await request.json();
  if (!text || !userId)
    return NextResponse.json(
      { success: false, message: "Missing text or userId" },
      { status: 400 }
    );
  const todo = { id: Date.now(), text, done: false, userId };
  todos.push(todo);
  return NextResponse.json({ success: true, todo });
}

export async function PUT(request: NextRequest) {
  const { id, done, userId } = await request.json();
  if (!id || userId === undefined)
    return NextResponse.json(
      { success: false, message: "Missing id or userId" },
      { status: 400 }
    );
  const todo = todos.find((t) => t.id === id && t.userId === userId);
  if (!todo)
    return NextResponse.json(
      { success: false, message: "Todo not found" },
      { status: 404 }
    );
  todo.done = !!done;
  return NextResponse.json({ success: true, todo });
}

export async function DELETE(request: NextRequest) {
  const { id, userId } = await request.json();
  if (!id || !userId)
    return NextResponse.json(
      { success: false, message: "Missing id or userId" },
      { status: 400 }
    );

  const index = todos.findIndex((t) => t.id === id && t.userId === userId);
  if (index === -1)
    return NextResponse.json(
      { success: false, message: "Todo not found" },
      { status: 404 }
    );

  todos.splice(index, 1);
  return NextResponse.json({ success: true, message: "Todo removed" });
}
