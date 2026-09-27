import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import { ApplicationModel, JobModel } from '@/lib/models';
import { getSession } from '@/lib/session';

type Context = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Context) {
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) return NextResponse.json({ success: false, message: 'Job not found.' }, { status: 404 });
  await connectDB();
  const job = await JobModel.findById(id).populate('posterId', 'name location').populate('assignedFreelancerId', 'name location').lean();
  if (!job) return NextResponse.json({ success: false, message: 'Job not found.' }, { status: 404 });
  return NextResponse.json({ success: true, data: { job } });
}

export async function PATCH(req: NextRequest, { params }: Context) {
  const session = await getSession();
  if (!session) return NextResponse.json({ success: false, message: 'Sign in to manage this job.' }, { status: 401 });
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) return NextResponse.json({ success: false, message: 'Job not found.' }, { status: 404 });
  await connectDB();
  const job = await JobModel.findById(id);
  if (!job) return NextResponse.json({ success: false, message: 'Job not found.' }, { status: 404 });
  if (String(job.posterId) !== session.id && session.role !== 'admin') return NextResponse.json({ success: false, message: 'Only the job poster can manage applications.' }, { status: 403 });
  const { action, applicationId } = await req.json();
  if (action !== 'assign' || !mongoose.isValidObjectId(applicationId)) return NextResponse.json({ success: false, message: 'Invalid assignment request.' }, { status: 400 });
  if (job.status !== 'open' || job.assignedFreelancerId) return NextResponse.json({ success: false, message: 'This job is no longer accepting assignments.' }, { status: 409 });
  const application = await ApplicationModel.findOne({ _id: applicationId, jobId: id, status: { $in: ['pending', 'shortlisted'] } });
  if (!application) return NextResponse.json({ success: false, message: 'Application not found or no longer eligible.' }, { status: 404 });
  const assigned = await JobModel.findOneAndUpdate(
    { _id: id, status: 'open', assignedFreelancerId: null },
    { $set: { assignedFreelancerId: application.freelancerId, status: 'assigned' } },
    { new: true },
  );
  if (!assigned) return NextResponse.json({ success: false, message: 'Another assignment was just made for this job.' }, { status: 409 });
  await application.updateOne({ $set: { status: 'accepted' } });
  await ApplicationModel.updateMany({ jobId: id, _id: { $ne: application._id }, status: { $in: ['pending', 'shortlisted'] } }, { $set: { status: 'rejected' } });
  return NextResponse.json({ success: true, data: { job: assigned } });
}
