import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../../generated/prisma'; // hoặc '@prisma/client' nếu bạn dùng đúng chuẩn

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        clinic: true,
        country: true,
        occupation: true,
        ethnic: true
      },
      orderBy: { id: 'desc' }
    });
    return NextResponse.json(bookings, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:3000',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Lỗi server', detail: error?.message }, {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:3000',
      },
    });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': 'http://localhost:3000',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
} 