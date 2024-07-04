import { createUserInDb } from '@/lib/firebase/admin/auth';
import { auth } from '@/lib/firebase/admin/auth';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const headers = req.headers;

  if (!headers.get('Authorization'))
    return Response.json({ message: 'No ID token provided.' }, { status: 401 });

  try {
    const decodedToken = await auth.verifyIdToken(
      headers.get('Authorization')!
    );
    const userUid = decodedToken.uid;

    await createUserInDb(userUid);

    return Response.json({ message: 'User created!' }, { status: 201 });
  } catch (err) {
    return Response.json({ message: 'Invalid ID token.' }, { status: 401 });
  }
}
