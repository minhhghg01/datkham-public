import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../../generated/prisma";

const prisma = new PrismaClient();

//put booking
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
    try {
      const body = await req.json();
      const { status } = body;
  
      const updatedBooking = await prisma.booking.update({
        where: { id: Number(id) },
        data: { status },
      });
  
      return NextResponse.json(updatedBooking, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': 'http://localhost:3000',
        },
      });
    } catch (error: any) {
      return NextResponse.json({ error: 'Cập nhật thất bại', detail: error?.message }, {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': 'http://localhost:3000',
        },
      });
    }
  }
  
  // OPTIONS: Cho phép CORS preflight
  export async function OPTIONS() {
    return new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:3000',
        'Access-Control-Allow-Methods': 'PUT, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }