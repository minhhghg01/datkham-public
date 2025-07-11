import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../../generated/prisma';
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function getUserFromRequest(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth || !auth.startsWith("Bearer ")) return null;
  const token = auth.split(" ")[1];
  try {
    return jwt.verify(token, "SECRET_KEY");
  } catch {
    return null;
  }
}

/**
 * @swagger
 * /api/clinic:
 *   get:
 *     summary: Lấy danh sách tất cả các phòng khám
 *     description: Trả về một danh sách đầy đủ các phòng khám có trong hệ thống.
 *     responses:
 *       200:
 *         description: Một mảng JSON chứa danh sách các phòng khám.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID của phòng khám.
 *                   name:
 *                     type: string
 *                     description: Tên của phòng khám.
 */
// Lấy danh sách tất cả phòng khám
export async function GET() {
  try {
    console.log("Bắt đầu lấy danh sách phòng khám...");
    const clinics = await prisma.clinic.findMany();
    // console.log("Dữ liệu phòng khám lấy được từ DB:", clinics);

    if (!clinics) {
      console.log("Không tìm thấy phòng khám nào.");
      return new Response(JSON.stringify({ message: "Không có phòng khám nào" }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      });
    }

    return new Response(JSON.stringify(clinics), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...CORS_HEADERS,
      },
    });
  } catch (error) {
    console.error("!!!!!!!!!!!!!!!!! LỖI TẠI /api/clinic GET !!!!!!!!!!!!!!!!!");
    console.error(error);
    console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    return new Response(JSON.stringify({ error: 'Lỗi server', detail: error instanceof Error ? error.message : undefined }), {
      status: 500,
      headers: CORS_HEADERS,
    });
  }
}

/**
 * @swagger
 * /api/clinic:
 *   post:
 *     summary: Tạo một phòng khám mới
 *     description: Tạo một phòng khám mới với tên được cung cấp.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Tên của phòng khám mới.
 *                 example: "Phòng khám Đa khoa Quốc tế"
 *     responses:
 *       200:
 *         description: Tạo phòng khám thành công.
 *       400:
 *         description: Thiếu thông tin tên phòng khám.
 *       500:
 *         description: Lỗi từ máy chủ.
 */
// Tạo mới phòng khám
export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) {
    return new Response(JSON.stringify({ error: "Chưa đăng nhập" }), {
      status: 401,
      headers: CORS_HEADERS,
    });
  }
  if (user.role !== "admin") {
    return new Response(JSON.stringify({ error: "Không đủ quyền" }), {
      status: 403,
      headers: CORS_HEADERS,
    });
  }
  try {
    const { name } = await req.json();
    if (!name) {
      return new Response(JSON.stringify({ error: 'Thiếu thông tin' }), {
        status: 400,
        headers: CORS_HEADERS,
      });
    }
    const clinic = await prisma.clinic.create({ data: { name } });
    return new Response(JSON.stringify(clinic), {
      headers: {
        'Content-Type': 'application/json',
        ...CORS_HEADERS,
      },
    });
  } catch (error) {
    console.error("!!!!!!!!!!!!!!!!! LỖI TẠI /api/clinic POST !!!!!!!!!!!!!!!!!");
    console.error(error);
    console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    return new Response(JSON.stringify({ error: 'Lỗi server', detail: error instanceof Error ? error.message : undefined }), {
      status: 500,
      headers: CORS_HEADERS,
    });
  }
}

// Đáp ứng preflight request (OPTIONS)
export async function OPTIONS(request: Request) {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
} 