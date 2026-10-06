import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { UserModel } from '@/lib/models';
import { getSession } from '@/lib/session';

const PROFILE_LISTS = ['skills', 'languages', 'education', 'certifications'] as const;
const PROFILE_TEXT: Record<string, number> = {
  name: 100,
  phone: 40,
  company: 120,
  location: 120,
  bio: 2000,
  portfolio: 500,
};

export async function PATCH(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ success: false, message: 'Sign in to update your profile.' }, { status: 401 });

  const body: unknown = await request.json().catch(() => null);
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return NextResponse.json({ success: false, message: 'Provide valid profile details.' }, { status: 400 });
  }

  const input = body as Record<string, unknown>;
  const updates: Record<string, unknown> = {};
  for (const [field, maxLength] of Object.entries(PROFILE_TEXT)) {
    if (!(field in input)) continue;
    if (typeof input[field] !== 'string' || (field === 'name' && !input[field].trim())) {
      return NextResponse.json({ success: false, message: 'Enter a valid name and text profile details.' }, { status: 400 });
    }
    const value = (input[field] as string).trim();
    if (value.length > maxLength) return NextResponse.json({ success: false, message: `${field} is too long.` }, { status: 400 });
    if (field === 'portfolio' && value) {
      try {
        const url = new URL(value);
        if (url.protocol !== 'http:' && url.protocol !== 'https:') throw new Error();
      } catch {
        return NextResponse.json({ success: false, message: 'Portfolio must be a valid http or https URL.' }, { status: 400 });
      }
    }
    updates[field] = value;
  }

  if (session.role === 'freelancer') {
    for (const field of PROFILE_LISTS) {
      if (!(field in input)) continue;
      if (!Array.isArray(input[field]) || input[field].length > 30 || input[field].some(value => typeof value !== 'string' || value.length > 120)) {
        return NextResponse.json({ success: false, message: `Provide a valid ${field} list.` }, { status: 400 });
      }
      updates[field] = (input[field] as string[]).map(value => value.trim()).filter(Boolean);
    }

    if ('hourlyRate' in input) {
      const rate = Number(input.hourlyRate);
      if (!Number.isFinite(rate) || rate < 0 || rate > 1000000) return NextResponse.json({ success: false, message: 'Enter a valid hourly rate.' }, { status: 400 });
      updates.hourlyRate = rate;
    }
    if ('experienceYears' in input) {
      const years = Number(input.experienceYears);
      if (!Number.isInteger(years) || years < 0 || years > 60) return NextResponse.json({ success: false, message: 'Enter years of experience from 0 to 60.' }, { status: 400 });
      updates.experienceYears = years;
    }
    if ('skillLevel' in input) {
      if (!['beginner', 'intermediate', 'expert'].includes(String(input.skillLevel))) return NextResponse.json({ success: false, message: 'Choose a valid skill level.' }, { status: 400 });
      updates.skillLevel = input.skillLevel;
    }
    if ('availability' in input) {
      if (!['available', 'limited', 'unavailable'].includes(String(input.availability))) return NextResponse.json({ success: false, message: 'Choose a valid availability.' }, { status: 400 });
      updates.availability = input.availability;
    }
  }

  if (!Object.keys(updates).length) return NextResponse.json({ success: false, message: 'No profile changes were provided.' }, { status: 400 });

  try {
    await connectDB();
    const user = await UserModel.findByIdAndUpdate(session.id, { $set: updates }, { new: true, runValidators: true })
      .select('-email -interlinkLoginId');
    if (!user) return NextResponse.json({ success: false, message: 'Account not found.' }, { status: 404 });
    return NextResponse.json({ success: true, data: { user } }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ success: false, message: 'Could not save profile changes.' }, { status: 500 });
  }
}