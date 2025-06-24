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
 * /api/country:
 *   get:
 *     description: Returns the list of countries
 *     responses:
 *       200:
 *         description: A list of countries.
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
  console.log('GET /api/country - Start');
  
  try {
    const countries = await prisma.country.findMany();
    // console.log('GET /api/country - Data:', countries);

    if (!countries || countries.length === 0) {
      console.log('GET /api/country - No data found');
      return NextResponse.json({ message: 'No countries found', data: [] }, {
        status: 200,
        headers: corsHeaders
      });
    }

    return NextResponse.json(countries, {
      status: 200,
      headers: corsHeaders
    });
  } catch (error) {
    console.error('GET /api/country - Error:', error);
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