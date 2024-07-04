import { notAuthenticatedReponse } from '@/lib/utils/api/responses';
import { db } from './db';
import { DecodedIdToken, getAuth } from 'firebase-admin/auth';
import { FieldValue } from 'firebase-admin/firestore';

export const auth = getAuth();

const getAuthUserDetailsFromUid = async (userUid: string) => {
  const user = await auth.getUser(userUid);

  return {
    uid: userUid,
    name: user.displayName || 'annonymous',
    email: user.email!,
  };
};

export async function getDbUserDetailsFromUid(userUid: string) {
  const userRef = db.doc(`$users/${userUid}`);
  const userDb = await userRef.get();

  return userDb.data();
}

export async function createUserInDb(userUid: string) {
  const user = await getAuthUserDetailsFromUid(userUid);

  const userDocRef = db.doc(`users/${userUid}`);
  const userDb = await userDocRef.get();

  if (userDb.exists) return;

  await db.collection('/users').doc(user.uid).set({
    name: user.name,
    email: user.email,
    plan: 'starter',
    invocations: 0,
  });
}

export async function incrementUserInvocation(userUid: string) {
  const userDocRef = db.doc(`users/${userUid}`);

  await userDocRef.update({ invocations: FieldValue.increment(1) });
}

export async function verifyIdToken(
  headers: Headers
): Promise<[DecodedIdToken, null] | [null, Response]> {
  const authorizationHeader = headers.get('Authorization');

  if (!authorizationHeader) return [null, notAuthenticatedReponse()];

  const authorizationHeaderArray = authorizationHeader.split(' ');

  if (
    authorizationHeaderArray.length !== 2 ||
    authorizationHeaderArray[0] !== 'Bearer' ||
    !authorizationHeaderArray[1].trim()
  )
    return [null, notAuthenticatedReponse()];

  try {
    const decodedToken = await auth.verifyIdToken(authorizationHeaderArray[1]);

    return [decodedToken, null];
  } catch (err) {
    return [null, notAuthenticatedReponse()];
  }
}
