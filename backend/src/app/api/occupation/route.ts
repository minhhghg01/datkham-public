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
 * /api/occupation:
 *   get:
 *     summary: Lấy danh sách nghề nghiệp
 *     responses:
 *       200:
 *         description: Danh sách nghề nghiệp
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
  console.log('GET /api/occupation - Start');
  
  try {
    const occupations = await prisma.occupation.findMany();
    // console.log('GET /api/occupation - Data:', occupations);

    if (!occupations || occupations.length === 0) {
      console.log('GET /api/occupation - No data found');
      return NextResponse.json({ message: 'No occupations found', data: [] }, {
        status: 200,
        headers: corsHeaders
      });
    }

    return NextResponse.json(occupations, {
      status: 200,
      headers: corsHeaders
    });
  } catch (error) {
    console.error('GET /api/occupation - Error:', error);
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