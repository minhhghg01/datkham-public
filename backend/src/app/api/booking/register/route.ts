import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../../../generated/prisma'; // hoặc '@prisma/client' nếu bạn dùng đúng chuẩn

const prisma = new PrismaClient();

// Thêm method OPTIONS để xử lý preflight CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': 'http://localhost:3000', // Cho phép frontend truy cập
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    console.log("Bắt đầu xử lý đăng ký...");
    const requestData = await req.json();
    console.log("Dữ liệu nhận được:", requestData);

    const {
      clinicRoom,
      name,
      dateOfBirth,
      gender,
      phone,
      cccd,
      address,
      countryId,
      occupationId,
      ethnicId,
      date,
      time
    } = requestData;

    // Kiểm tra các trường bắt buộc
    const requiredFields = {
      clinicRoom,
      name,
      dateOfBirth,
      gender,
      phone,
      cccd,
      address,
      countryId,
      occupationId,
      ethnicId,
      date,
      time
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      console.log("Thiếu các trường:", missingFields);
      return new NextResponse(JSON.stringify({ 
        error: 'Thiếu thông tin bắt buộc', 
        missingFields 
      }), {
        status: 400,
        headers: {
          'Access-Control-Allow-Origin': 'http://localhost:3000',
        },
      });
    }

    // Kiểm tra phòng khám tồn tại
    console.log("Kiểm tra phòng khám:", clinicRoom);
    const clinic = await prisma.clinic.findUnique({ where: { id: clinicRoom } });
    if (!clinic) {
      console.log("Không tìm thấy phòng khám");
      return new NextResponse(JSON.stringify({ error: 'Phòng khám không tồn tại' }), {
        status: 404,
        headers: {
          'Access-Control-Allow-Origin': 'http://localhost:3000',
        },
      });
    }

    // Tạo booking mới
    console.log("Tạo booking mới...");
    const booking = await prisma.booking.create({
      data: {
        clinicId: clinic.id,
        date: new Date(`${date}T${time}:00`),
        time,
        status: 'pending',
        name,
        dateOfBirth: new Date(dateOfBirth),
        gender,
        phone,
        cccd,
        address,
        countryId,
        occupationId,
        ethnicId
      },
      include: {
        clinic: true,
        country: true,
        occupation: true,
        ethnic: true
      },
    });

    console.log("Đăng ký thành công:", booking);
    return new NextResponse(JSON.stringify({ booking }), {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:3000',
      },
    });
  } catch (error: any) {
    console.error("Lỗi server:", error);
    return new NextResponse(JSON.stringify({ 
      error: 'Lỗi server', 
      detail: error?.message,
      stack: error?.stack
    }), {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:3000',
      },
    });
  }
}
