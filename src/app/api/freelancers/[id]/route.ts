import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import { UserModel, JobModel } from '@/lib/models';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) return NextResponse.json({ success: false, message: 'Freelancer not found.' }, { status: 404 });
  await connectDB();
  const freelancer = await UserModel.findOne({ _id: id, role: 'translator', isActive: true }).select('-password -email').lean();
  if (!freelancer) return NextResponse.json({ success: false, message: 'Freelancer not found.' }, { status: 404 });
  const [completedJobs, activeJobs] = await Promise.all([
    JobModel.countDocuments({ assignedFreelancerId: id, status: 'completed' }),
    JobModel.find({ assignedFreelancerId: id, status: 'in_progress' }).select('title category').sort({ updatedAt: -1 }).limit(5).lean(),
  ]);
  return NextResponse.json({ success: true, data: { freelancer: { ...freelancer, completedJobs, activeJobs } } });
}
