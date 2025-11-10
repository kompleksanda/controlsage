import { NextResponse, type NextRequest } from 'next/server';
import { initializeApp, getApps, getApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { cookies } from 'next/headers';

// Initialize Firebase Admin SDK
if (!getApps().length) {
  initializeApp();
}

export async function POST(request: NextRequest) {
  const authorization = request.headers.get('Authorization');
  if (authorization?.startsWith('Bearer ')) {
    const idToken = authorization.split('Bearer ')[1];
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

    try {
      const sessionCookie = await getAuth(getApp()).createSessionCookie(idToken, { expiresIn });
      cookies().set('session', sessionCookie, { maxAge: expiresIn, httpOnly: true, secure: true, path: '/' });
      return NextResponse.json({ sessionCookie });
    } catch (error) {
      console.error('Error creating session cookie:', error);
      return NextResponse.json({ error: 'Failed to create session' }, { status: 401 });
    }
  }

  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

export async function DELETE() {
  cookies().delete('session');
  return NextResponse.json({ success: true });
}
