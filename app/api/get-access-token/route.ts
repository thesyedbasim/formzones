import { createBearerToken } from '@/lib/api/api_utils';
import {
  getDbUserDetailsFromUid,
  verifyIdToken,
} from '@/lib/firebase/admin/auth';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const [decodedIdToken, verifyIdTokenError] = await verifyIdToken(req.headers);
  if (verifyIdTokenError) return verifyIdTokenError;

  const user = await getDbUserDetailsFromUid(decodedIdToken.uid);

  if (!user)
    return Response.json({ message: 'User does not exist!' }, { status: 401 });

  const accessToken = createBearerToken({
    userUid: decodedIdToken.uid,
    email: decodedIdToken.email!,
    plan: user.plan,
  });

  console.log('access token', accessToken);

  return Response.json(
    { message: 'Access token created!', data: { accessToken } },
    { status: 200 }
  );
}
