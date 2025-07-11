import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../generated/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import type { JwtPayload } from "jsonwebtoken";
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

function getUserFromRequest(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth || !auth.startsWith("Bearer ")) return null;
  const token = auth.split(" ")[1];
  try {
    return jwt.verify(token, "SECRET_KEY") as JwtPayload;
  } catch {
    return null;
  }
}

// Lấy danh sách user
export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) return withCORS(NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 }));
  if (user.role !== "admin" && user.role !== "cntt") {
    return withCORS(NextResponse.json({ error: "Không đủ quyền" }, { status: 403 }));
  }
  const users = await prisma.user.findMany();
  return withCORS(NextResponse.json(users));
}

// Tạo user mới
export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) return withCORS(NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 }));
  if (user.role !== "admin" && user.role !== "cntt") {
    return withCORS(NextResponse.json({ error: "Không đủ quyền" }, { status: 403 }));
  }
  try {
    const data = await req.json();
    if (!isValidPassword(data.password)) {
      return withCORS(NextResponse.json({ error: "Mật khẩu phải có ít nhất 1 chữ cái in hoa, 1 ký tự đặc biệt, có cả chữ và số, tối thiểu 8 ký tự." }, { status: 400 }));
    }
    if (!data.name || !data.username || !data.phone || !data.role || !data.password) {
      return withCORS(NextResponse.json({ error: "Thiếu thông tin bắt buộc." }, { status: 400 }));
    }
    if ('id' in data) delete data.id;
    if (!data.password.startsWith("$2")) {
      data.password = bcrypt.hashSync(data.password, 10);
    }
    const newUser = await prisma.user.create({ data });
    return withCORS(NextResponse.json(newUser));
  } catch (err: any) {
    if (err.code === 'P2002') {
      return withCORS(NextResponse.json({ error: "Tên đăng nhập đã tồn tại." }, { status: 400 }));
    }
    return withCORS(NextResponse.json({ error: err.message || "Lỗi server khi tạo user." }, { status: 500 }));
  }
}

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: Đăng nhập
 *     description: Đăng nhập bằng username và password, trả về token JWT và role nếu thành công.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 role:
 *                   type: string
 *       401:
 *         description: Sai tài khoản hoặc mật khẩu
 */
// Đã chuyển hàm POST_login sang /api/user/login/route.ts

// Cập nhật user
export async function PUT(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) return withCORS(NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 }));
  if (user.role !== "admin" && user.role !== "cntt") {
    return withCORS(NextResponse.json({ error: "Không đủ quyền" }, { status: 403 }));
  }
  const data = await req.json();
  const { id, ...updateData } = data;
  if (updateData.password) {
    if (!isValidPassword(updateData.password)) {
      return withCORS(NextResponse.json({ error: "Mật khẩu phải có ít nhất 1 chữ cái in hoa, 1 ký tự đặc biệt, có cả chữ và số, tối thiểu 8 ký tự." }, { status: 400 }));
    }
    // Hash password nếu chưa hash
    if (!updateData.password.startsWith("$2")) {
      updateData.password = bcrypt.hashSync(updateData.password, 10);
    }
  }
  const updatedUser = await prisma.user.update({ where: { id }, data: updateData });
  return withCORS(NextResponse.json(updatedUser));
}

// Xóa user
export async function DELETE(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) return withCORS(NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 }));
  if (user.role !== "admin" && user.role !== "cntt") {
    return withCORS(NextResponse.json({ error: "Không đủ quyền" }, { status: 403 }));
  }
  const { id } = await req.json();
  await prisma.user.delete({ where: { id } });
  return withCORS(NextResponse.json({ success: true }));
}

// Đáp ứng preflight OPTIONS
export async function OPTIONS() {
  return withCORS(new NextResponse(null, { status: 200 }));
} 