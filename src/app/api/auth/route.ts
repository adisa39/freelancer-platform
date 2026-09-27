import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import { UserModel } from '@/lib/models';

const JWT_SECRET = process.env.JWT_SECRET || 'bfblessy_secret_change_in_prod';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { action } = body;

    // ── Register ──────────────────────────────────────────────────────────────
    if (action === 'register') {
      const { name, email, password, phone, role, location, bio, skills } = body;

      if (!name || !email || !password) {
        return NextResponse.json({ success: false, message: 'Name, email and password are required.' }, { status: 400 });
      }
      if (password.length < 8) {
        return NextResponse.json({ success: false, message: 'Password must be at least 8 characters.' }, { status: 400 });
      }

      const existing = await UserModel.findOne({ email: email.toLowerCase() });
      if (existing) {
        return NextResponse.json({ success: false, message: 'Email already registered.' }, { status: 409 });
      }

      const safeRole = role === 'translator' ? 'translator' : 'client';
      const user = await UserModel.create({
        name, email: email.toLowerCase(), password, phone, role: safeRole, location,
        bio: safeRole === 'translator' ? String(bio || '').slice(0, 2000) : undefined,
        skills: safeRole === 'translator' && Array.isArray(skills) ? skills.map(String).slice(0, 20) : [],
      });
      const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

      const userObj = user.toObject();
      delete (userObj as any).password;

      const res = NextResponse.json({ success: true, message: 'Account created successfully.', data: { user: userObj, token } }, { status: 201 });
      res.cookies.set('bf_token', token, { httpOnly: true, maxAge: 60 * 60 * 24 * 7, path: '/', sameSite: 'lax' });
      return res;
    }

    // ── Login ─────────────────────────────────────────────────────────────────
    if (action === 'login') {
      const { email, password } = body;

      if (!email || !password) {
        return NextResponse.json({ success: false, message: 'Email and password are required.' }, { status: 400 });
      }

      const user = await UserModel.findOne({ email: email.toLowerCase() }).select('+password');
      if (!user || !user.isActive) {
        return NextResponse.json({ success: false, message: 'Invalid credentials.' }, { status: 401 });
      }

      const valid = await user.comparePassword(password);
      if (!valid) {
        return NextResponse.json({ success: false, message: 'Invalid credentials.' }, { status: 401 });
      }

      const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
      const userObj = user.toObject();
      delete (userObj as any).password;

      const res = NextResponse.json({ success: true, message: 'Logged in successfully.', data: { user: userObj, token } });
      res.cookies.set('bf_token', token, { httpOnly: true, maxAge: 60 * 60 * 24 * 7, path: '/', sameSite: 'lax' });
      return res;
    }

    // ── Logout ────────────────────────────────────────────────────────────────
    if (action === 'logout') {
      const res = NextResponse.json({ success: true, message: 'Logged out.' });
      res.cookies.delete('bf_token');
      return res;
    }

    return NextResponse.json({ success: false, message: 'Invalid action.' }, { status: 400 });
  } catch (error) {
    console.error('[AUTH ERROR]', error);
    return NextResponse.json({ success: false, message: 'Internal server error.' }, { status: 500 });
  }
}

// ── GET current user ──────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('bf_token')?.value;
    if (!token) return NextResponse.json({ success: false, message: 'Not authenticated.' }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    await connectDB();
    const user = await UserModel.findById(decoded.id).select('-password');
    if (!user) return NextResponse.json({ success: false, message: 'User not found.' }, { status: 404 });

    return NextResponse.json({ success: true, data: { user } });
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid token.' }, { status: 401 });
  }
}
