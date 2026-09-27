import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { UserModel, JobModel } from '@/lib/models';

export async function GET() {
  await connectDB();
  const people = await UserModel.find({ role: 'translator', isActive: true }).select('name location bio skills languages').sort({ createdAt: -1 }).limit(50).lean();
  const freelancers = await Promise.all(people.map(async person => ({ ...person, completedJobs: await JobModel.countDocuments({ assignedFreelancerId: person._id, status: 'completed' }) })));
  return NextResponse.json({ success: true, data: { freelancers } });
}
