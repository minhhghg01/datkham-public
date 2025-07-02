import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../generated/prisma";
const prisma = new PrismaClient();

function withCORS(res: NextResponse) {
  res.headers.set('Access-Control-Allow-Origin', '*');
  res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return res;
}

function isValidPassword(password: string) {
  // Ít nhất 1 chữ hoa, 1 ký tự đặc biệt, có cả chữ và số, tối thiểu 8 ký tự
  return /[A-Z]/.test(password) && /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password) && /[a-zA-Z]/.test(password) && /\d/.test(password) && password.length >= 8;
}

// Lấy danh sách user
export async function GET() {
  const users = await prisma.user.findMany();
  return withCORS(NextResponse.json(users));
}

// Tạo user mới
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    if (!isValidPassword(data.password)) {
      return withCORS(NextResponse.json({ error: "Mật khẩu phải có ít nhất 1 chữ cái in hoa, 1 ký tự đặc biệt, có cả chữ và số, tối thiểu 8 ký tự." }, { status: 400 }));
    }
    // Kiểm tra các trường bắt buộc
    if (!data.name || !data.username || !data.phone || !data.role || !data.password) {
      return withCORS(NextResponse.json({ error: "Thiếu thông tin bắt buộc." }, { status: 400 }));
    }
    // Xóa trường id nếu có
    if ('id' in data) delete data.id;
    const user = await prisma.user.create({ data });
    return withCORS(NextResponse.json(user));
  } catch (err: any) {
    console.error("Lỗi khi tạo user:", err); // Log lỗi ra terminal
    // Lỗi unique hoặc lỗi khác
    if (err.code === 'P2002') {
      return withCORS(NextResponse.json({ error: "Tên đăng nhập đã tồn tại." }, { status: 400 }));
    }
    return withCORS(NextResponse.json({ error: err.message || "Lỗi server khi tạo user." }, { status: 500 }));
  }
}

// Cập nhật user
export async function PUT(req: NextRequest) {
  const data = await req.json();
  const { id, ...updateData } = data;
  if (updateData.password && !isValidPassword(updateData.password)) {
    return withCORS(NextResponse.json({ error: "Mật khẩu phải có ít nhất 1 chữ cái in hoa, 1 ký tự đặc biệt, có cả chữ và số, tối thiểu 8 ký tự." }, { status: 400 }));
  }
  const user = await prisma.user.update({ where: { id }, data: updateData });
  return withCORS(NextResponse.json(user));
}

// Xóa user
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  await prisma.user.delete({ where: { id } });
  return withCORS(NextResponse.json({ success: true }));
}

// Đáp ứng preflight OPTIONS
export async function OPTIONS() {
  return withCORS(new NextResponse(null, { status: 200 }));
} 