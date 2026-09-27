import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { JobModel } from '@/lib/models';
import { getSession } from '@/lib/session';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const filter: Record<string, unknown> = {};
    if (searchParams.get('status')) filter.status = searchParams.get('status');
    const query = searchParams.get('q')?.trim();
    if (query) {
      const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [{ title: { $regex: safeQuery, $options: 'i' } }, { category: { $regex: safeQuery, $options: 'i' } }, { skills: { $regex: safeQuery, $options: 'i' } }];
    }
    const jobs = await JobModel.find(filter).populate('posterId', 'name location').sort({ createdAt: -1 }).limit(50).lean();
    return NextResponse.json({ success: true, data: { jobs } });
  } catch {
    return NextResponse.json({ success: false, message: 'Could not load jobs.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ success: false, message: 'Sign in to post a job.' }, { status: 401 });
  if (session.role !== 'client' && session.role !== 'admin') return NextResponse.json({ success: false, message: 'Only job posters can post jobs.' }, { status: 403 });
  try {
    const body = await req.json();
    if (!body.title || !body.description || !body.category || !Array.isArray(body.skills) || !Number.isFinite(body.budgetMin) || !Number.isFinite(body.budgetMax) || body.budgetMax < body.budgetMin) {
      return NextResponse.json({ success: false, message: 'Provide a title, description, category, skills, and a valid budget.' }, { status: 400 });
    }
    await connectDB();
    const job = await JobModel.create({
      posterId: session.id, title: String(body.title).trim(), description: String(body.description).trim(),
      category: body.category, skills: body.skills.map(String).slice(0, 20), budgetMin: body.budgetMin,
      budgetMax: body.budgetMax, paymentType: body.paymentType, deadline: body.deadline || undefined,
    });
    return NextResponse.json({ success: true, data: { job } }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, message: 'Could not create job.' }, { status: 500 });
  }
}
