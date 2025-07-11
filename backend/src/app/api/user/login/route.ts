import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../../generated/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function withCORS(res: NextResponse) {
  res.headers.set('Access-Control-Allow-Origin', '*');
  res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return res;
}

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return withCORS(NextResponse.json({ error: "Sai tài khoản hoặc mật khẩu" }, { status: 401 }));
    }
    // Nếu đã hash password thì dùng bcrypt, nếu chưa thì so sánh trực tiếp
    const isMatch = user.password.startsWith("$2")
      ? bcrypt.compareSync(password, user.password)
      : user.password === password;
    if (!isMatch) {
      return withCORS(NextResponse.json({ error: "Sai tài khoản hoặc mật khẩu" }, { status: 401 }));
    }
    const token = jwt.sign({ id: user.id, role: user.role }, "SECRET_KEY", { expiresIn: "1d" });
    return withCORS(NextResponse.json({ token, role: user.role }));
  } catch (err) {
    return withCORS(NextResponse.json({ error: "Lỗi server khi đăng nhập" }, { status: 500 }));
  }
}

export async function OPTIONS() {
  return withCORS(new NextResponse(null, { status: 200 }));
} 