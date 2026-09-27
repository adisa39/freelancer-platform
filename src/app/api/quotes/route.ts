import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { QuoteModel } from '@/lib/models';

// POST — Submit a quote request
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, email, sourceLanguage, targetLanguage } = body;

    if (!name || !email || !sourceLanguage || !targetLanguage) {
      return NextResponse.json({ success: false, message: 'Name, email, source and target languages are required.' }, { status: 400 });
    }

    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRx.test(email)) {
      return NextResponse.json({ success: false, message: 'Invalid email address.' }, { status: 400 });
    }

    const quote = await QuoteModel.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: body.phone,
      sourceLanguage,
      targetLanguage,
      serviceType: body.serviceType,
      documentType: body.documentType,
      wordCount: body.wordCount ? Number(body.wordCount) : undefined,
      deadline: body.deadline ? new Date(body.deadline) : undefined,
      notes: body.notes,
      status: 'pending',
    });

    return NextResponse.json({
      success: true,
      message: 'Quote request submitted successfully. We will respond within 2 hours.',
      data: { quote },
    }, { status: 201 });
  } catch (error) {
    console.error('[QUOTES POST]', error);
    return NextResponse.json({ success: false, message: 'Internal server error.' }, { status: 500 });
  }
}

// GET — List all quotes (admin)
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');

    const filter: Record<string, string> = {};
    if (status) filter.status = status;

    const [quotes, total] = await Promise.all([
      QuoteModel.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      QuoteModel.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      data: { quotes },
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('[QUOTES GET]', error);
    return NextResponse.json({ success: false, message: 'Internal server error.' }, { status: 500 });
  }
}
