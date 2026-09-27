import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import { OrderModel } from '@/lib/models';

const JWT_SECRET = process.env.JWT_SECRET || 'bfblessy_secret_change_in_prod';

function getUserFromRequest(req: NextRequest): { id: string; role: string } | null {
  try {
    const token = req.cookies.get('bf_token')?.value || req.headers.get('authorization')?.split(' ')[1];
    if (!token) return null;
    return jwt.verify(token, JWT_SECRET) as { id: string; role: string };
  } catch { return null; }
}

export async function GET(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user) return NextResponse.json({ success: false, message: 'Authentication required.' }, { status: 401 });

    await connectDB();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');

    const filter: Record<string, unknown> = {};
    if (user.role !== 'admin') filter.userId = user.id;
    if (status) filter.status = status;

    const [orders, total] = await Promise.all([
      OrderModel.find(filter).populate('service', 'title category').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      OrderModel.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      data: { orders },
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('[ORDERS GET]', error);
    return NextResponse.json({ success: false, message: 'Internal server error.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    await connectDB();
    const body = await req.json();
    const { sourceLanguage, targetLanguage, price, service } = body;

    if (!sourceLanguage || !targetLanguage || !price) {
      return NextResponse.json({ success: false, message: 'sourceLanguage, targetLanguage and price are required.' }, { status: 400 });
    }

    const order = await OrderModel.create({
      ...body,
      userId: user?.id || null,
      guestEmail: !user ? body.email : undefined,
      status: 'pending',
    });

    return NextResponse.json({ success: true, message: 'Order created.', data: { order } }, { status: 201 });
  } catch (error) {
    console.error('[ORDERS POST]', error);
    return NextResponse.json({ success: false, message: 'Internal server error.' }, { status: 500 });
  }
}
