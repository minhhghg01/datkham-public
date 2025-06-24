import { PrismaClient } from '../../../generated/prisma';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

const prisma = new PrismaClient();

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

/**
 * @swagger
 * /api/ethnic:
 *   get:
 *     summary: Lấy danh sách dân tộc
 *     responses:
 *       200:
 *         description: Danh sách dân tộc
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 */
export async function GET() {
  console.log('GET /api/ethnic - Start');
  
  try {
    const ethnics = await prisma.ethnic.findMany();
    // console.log('GET /api/ethnic - Data:', ethnics);

    if (!ethnics || ethnics.length === 0) {
      console.log('GET /api/ethnic - No data found');
      return NextResponse.json({ message: 'No ethnics found', data: [] }, {
        status: 200,
        headers: corsHeaders
      });
    }

    return NextResponse.json(ethnics, {
      status: 200,
      headers: corsHeaders
    });
  } catch (error) {
    console.error('GET /api/ethnic - Error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, {
      status: 500,
      headers: corsHeaders
    });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
} 