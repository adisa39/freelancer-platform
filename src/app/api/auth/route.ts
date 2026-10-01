import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'node:crypto';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import { UserModel } from '@/lib/models';
import { env, getJwtSecret } from '@/lib/env';

const INTERLINK_APP_ID = env.INTERLINK_APP_ID;
const INTERLINK_API = 'https://interlink-mini-app.interlinklabs.ai/api/tracking';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') return NextResponse.json({ success: false, message: 'Invalid request body.' }, { status: 400 });
    if (body.action === 'logout') {
      const res = NextResponse.json({ success: true, message: 'Signed out.' });
      res.cookies.delete('bf_token');
      return res;
    }

    if (body.action !== 'interlink') return NextResponse.json({ success: false, message: 'Use InterLink ID to sign in.' }, { status: 400 });
    if (body.flow !== 'login' && body.flow !== 'register') return NextResponse.json({ success: false, message: 'Choose sign-in or profile creation to continue.' }, { status: 400 });
    if (!INTERLINK_APP_ID) return NextResponse.json({ success: false, message: 'InterLink App ID is not configured on the server.' }, { status: 503 });
    if (typeof body.webToken !== 'string' || body.webToken.length > 12000) return NextResponse.json({ success: false, message: 'InterLink did not provide a valid sign-in token.' }, { status: 400 });

    // Verify the web token directly with InterLink before creating our own app session.
    const verification = await fetch(`${INTERLINK_API}/validate-app-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: body.webToken, appId: INTERLINK_APP_ID }),
      cache: 'no-store',
      signal: AbortSignal.timeout(10000),
    });
    if (!verification.ok) return NextResponse.json({ success: false, message: 'InterLink could not verify this sign-in.' }, { status: 401 });
    const verified = await verification.json();
    const identity = verified?.data?.payload;
    if (!verified?.success || !verified?.data?.valid || typeof identity?.loginId !== 'string' || !identity.loginId.trim() || (identity.appId && identity.appId !== INTERLINK_APP_ID)) {
      return NextResponse.json({ success: false, message: 'InterLink could not verify this sign-in.' }, { status: 401 });
    }

    await connectDB();
    let user = await UserModel.findOne({ interlinkLoginId: identity.loginId });
    if (user && !user.isActive) return NextResponse.json({ success: false, message: 'This account is disabled. Contact support for help.' }, { status: 403 });
    if (!user) {
      if (body.flow === 'login') return NextResponse.json({ success: false, message: 'No Linker Marketplace profile is connected to this InterLink ID yet. Create your profile first.' }, { status: 404 });
      const profile = body.profile || {};
      const role = body.role === 'freelancer' ? 'freelancer' : 'client';
      const safeName = typeof profile.name === 'string' ? profile.name.trim().slice(0, 100) : '';
      
      const userNameResponse = await fetch(`${INTERLINK_API}/profile/${encodeURIComponent(String(identity.loginId))}`, {
        cache: 'no-store', signal: AbortSignal.timeout(8000),
      }).catch(() => null);
      
      const profileData = userNameResponse?.ok ? await userNameResponse.json().catch(() => null) : null;
      const verifiedName = profileData?.data?.username;
      const name = safeName || (typeof verifiedName === 'string' ? verifiedName.slice(0, 100) : '') || `Linker ${String(identity.loginId).slice(0, 8)}`;
      
      const skills = role === 'freelancer' && Array.isArray(profile.skills)
        ? profile.skills.filter((value: unknown): value is string => typeof value === 'string').map((value: string) => value.trim().slice(0, 60)).filter(Boolean).slice(0, 20)
        : [];

      user = await UserModel.create({
        name,
        // Keep legacy unique-email indexes safe during the migration; this is never shown as a contact email.
        email: `itl-${createHash('sha256').update(String(identity.loginId)).digest('hex')}@identity.invalid`,
        interlinkLoginId: identity.loginId,
        role,
        location: typeof profile.location === 'string' ? profile.location.trim().slice(0, 120) : undefined,
        bio: role === 'freelancer' && typeof profile.bio === 'string' ? profile.bio.trim().slice(0, 2000) : undefined,
        skills,
        isActive: true,
      });
    }

    const token = jwt.sign({ id: user._id.toString(), role: user.role, loginId: user.interlinkLoginId }, getJwtSecret(), { algorithm: 'HS256', expiresIn: '7d', issuer: 'bfblessy' });
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.email;
    const res = NextResponse.json({ success: true, data: { user: userObject } });

    res.cookies.set('bf_token', token, {
      httpOnly: true, secure: env.NODE_ENV === 'production', sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, path: '/',
    });

    return res;
  } catch (error) {
    console.error('[INTERLINK AUTH]', error);
    return NextResponse.json({ success: false, message: 'Could not complete InterLink sign-in. Please try again.' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('bf_token')?.value;
    if (!token) return NextResponse.json({ success: false, message: 'Not authenticated.' }, { status: 401 });
    const decoded = jwt.verify(token, getJwtSecret(), { algorithms: ['HS256'], issuer: 'bfblessy' }) as { id: string };
    await connectDB();
    const user = await UserModel.findById(decoded.id).select('-password -email');
    if (!user || !user.isActive) return NextResponse.json({ success: false, message: 'Account not found.' }, { status: 404 });
    return NextResponse.json({ success: true, data: { user } });
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid session.' }, { status: 401 });
  }
}
