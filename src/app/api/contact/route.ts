import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { ContactModel } from '@/lib/models';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ success: false, message: 'All fields are required.' }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, message: 'Invalid email address.' }, { status: 400 });
    }
    if (message.length < 10) {
      return NextResponse.json({ success: false, message: 'Message must be at least 10 characters.' }, { status: 400 });
    }

    const contact = await ContactModel.create({ name: name.trim(), email: email.toLowerCase().trim(), subject: subject.trim(), message: message.trim() });

    return NextResponse.json({ success: true, message: 'Message sent successfully. We will reply shortly.', data: { id: contact._id } }, { status: 201 });
  } catch (error) {
    console.error('[CONTACT POST]', error);
    return NextResponse.json({ success: false, message: 'Internal server error.' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const messages = await ContactModel.find({}).sort({ createdAt: -1 }).limit(50).lean();
    return NextResponse.json({ success: true, data: { messages } });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error.' }, { status: 500 });
  }
}
