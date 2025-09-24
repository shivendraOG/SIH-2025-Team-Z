import { NextResponse } from "next/server";
import books from "@/data/books.json"; // store json in /data

export async function GET() {
  return NextResponse.json(books);
}
