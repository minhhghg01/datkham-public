import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../../generated/prisma';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { clinicRoom, name, phone, date, time } = await req.json();
    if (!clinicRoom || !name || !phone || !date || !time) {
      return NextResponse.json({ error: 'Thiếu thông tin bắt buộc' }, { status: 400 });
    }

    // Kiểm tra phòng khám tồn tại
    const clinic = await prisma.clinic.findUnique({ where: { id: clinicRoom } });
    if (!clinic) {
      return NextResponse.json({ error: 'Phòng khám không tồn tại' }, { status: 404 });
    }

    // Tìm hoặc tạo user
    let user = await prisma.user.findUnique({ where: { phone } });
    if (!user) {
      user = await prisma.user.create({ data: { name, phone } });
    }

    // Tạo booking
    const booking = await prisma.booking.create({
      data: {
        userId: user.id,
        clinicId: clinic.id,
        date: new Date(`${date}T${time}:00`),
        status: 'pending',
      },
      include: { user: true, clinic: true },
    });

    return NextResponse.json({ booking });
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi server', detail: error?.message }, { status: 500 });
  }
} 