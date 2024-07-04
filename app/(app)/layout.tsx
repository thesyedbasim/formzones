'use client';

import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase/auth';

export default function AppLayout() {
  const router = useRouter();
  const [user, isLoading, error] = useAuthState(auth);

  if (isLoading) return <p className="">Loading...</p>;

  if (error) return <p className="">Error occurred!</p>;

  if (!user) return router.push('/auth');

  return 'you are logged in';
}
