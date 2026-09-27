import { NextRequest, NextResponse } from 'next/server';
import { JOB_CATEGORIES } from '@/lib/data';

// Simple API returning available job categories (service types)
export async function GET(_req: NextRequest) {
  return NextResponse.json({
    success: true,
    data: { services: JOB_CATEGORIES },
  });
}
