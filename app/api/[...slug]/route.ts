import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    { message: 'API route not found' },
    {
      status: 404,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    },
  );
}

export async function POST() {
  return NextResponse.json(
    { message: 'API route not found' },
    {
      status: 404,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    },
  );
}

// thêm PUT, DELETE nếu cần
