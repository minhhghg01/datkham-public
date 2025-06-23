import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../../../generated/prisma';

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/clinic/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết một phòng khám
 *     description: Trả về thông tin của một phòng khám cụ thể dựa trên ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của phòng khám cần lấy thông tin.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Thông tin chi tiết của phòng khám.
 *       404:
 *         description: Không tìm thấy phòng khám.
 */
// Lấy thông tin 1 phòng khám
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const clinic = await prisma.clinic.findUnique({ where: { id } });
  if (!clinic) return NextResponse.json({ error: 'Không tìm thấy phòng khám' }, { status: 404 });
  return NextResponse.json({ clinic });
}

/**
 * @swagger
 * /api/clinic/{id}:
 *   put:
 *     summary: Cập nhật thông tin phòng khám
 *     description: Cập nhật tên của một phòng khám cụ thể.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của phòng khám cần cập nhật.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Tên mới của phòng khám.
 *     responses:
 *       200:
 *         description: Cập nhật thành công.
 *       404:
 *         description: Không tìm thấy phòng khám hoặc lỗi server.
 */
// Cập nhật phòng khám
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const { name } = await req.json();
  try {
    const clinic = await prisma.clinic.update({ where: { id }, data: { name } });
    return NextResponse.json({ clinic });
  } catch (error) {
    return NextResponse.json({ error: 'Không tìm thấy hoặc lỗi server', detail: error?.message }, { status: 404 });
  }
}

/**
 * @swagger
 * /api/clinic/{id}:
 *   delete:
 *     summary: Xóa một phòng khám
 *     description: Xóa một phòng khám khỏi hệ thống dựa trên ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của phòng khám cần xóa.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Đã xóa phòng khám thành công.
 *       404:
 *         description: Không tìm thấy phòng khám hoặc lỗi server.
 */
// Xóa phòng khám
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  try {
    await prisma.clinic.delete({ where: { id } });
    return NextResponse.json({ message: 'Đã xóa phòng khám' });
  } catch (error) {
    return NextResponse.json({ error: 'Không tìm thấy hoặc lỗi server', detail: error?.message }, { status: 404 });
  }
} 