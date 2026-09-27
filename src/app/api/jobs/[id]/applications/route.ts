import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import { ApplicationModel, JobModel } from '@/lib/models';
import { getSession } from '@/lib/session';

type Context = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Context) {
  const session = await getSession();
  if (!session) return NextResponse.json({ success: false, message: 'Sign in to view applications.' }, { status: 401 });
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) return NextResponse.json({ success: false, message: 'Job not found.' }, { status: 404 });
  await connectDB();
  const job = await JobModel.findById(id).select('posterId');
  if (!job) return NextResponse.json({ success: false, message: 'Job not found.' }, { status: 404 });
  if (String(job.posterId) !== session.id && session.role !== 'admin') return NextResponse.json({ success: false, message: 'Only the job poster can view applications.' }, { status: 403 });
  const applications = await ApplicationModel.find({ jobId: id }).populate('freelancerId', 'name location bio skills languages').sort({ createdAt: -1 }).lean();
  return NextResponse.json({ success: true, data: { applications } });
}

export async function POST(req: NextRequest, { params }: Context) {
  const session = await getSession();
  if (!session) return NextResponse.json({ success: false, message: 'Sign in to apply.' }, { status: 401 });
  if (session.role !== 'translator') return NextResponse.json({ success: false, message: 'Freelancer accounts only.' }, { status: 403 });
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) return NextResponse.json({ success: false, message: 'Job not found.' }, { status: 404 });
  const body = await req.json();
  if (typeof body.coverLetter !== 'string' || body.coverLetter.trim().length < 30 || !Number.isFinite(body.proposedAmount) || body.proposedAmount <= 0 || !Number.isInteger(body.estimatedDays) || body.estimatedDays < 1) {
    return NextResponse.json({ success: false, message: 'Add a 30 character cover letter, proposed amount, and estimated delivery days.' }, { status: 400 });
  }
  await connectDB();
  const job = await JobModel.findById(id);
  if (!job || job.status !== 'open') return NextResponse.json({ success: false, message: 'This job is no longer open.' }, { status: 409 });
  if (String(job.posterId) === session.id) return NextResponse.json({ success: false, message: 'You cannot apply to your own job.' }, { status: 403 });
  try {
    const application = await ApplicationModel.create({ jobId: id, freelancerId: session.id, coverLetter: body.coverLetter.trim(), proposedAmount: body.proposedAmount, estimatedDays: body.estimatedDays });
    return NextResponse.json({ success: true, data: { application } }, { status: 201 });
  } catch (error) {
    if (error instanceof mongoose.mongo.MongoServerError && error.code === 11000) return NextResponse.json({ success: false, message: 'You have already applied to this job.' }, { status: 409 });
    return NextResponse.json({ success: false, message: 'Could not submit application.' }, { status: 500 });
  }
}
