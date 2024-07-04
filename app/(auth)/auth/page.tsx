'use client';

import React from 'react';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase/auth';
import AuthCard from '../components/AuthCard';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const router = useRouter();

  const [user, isLoading, error] = useAuthState(auth);

  if (isLoading) return <p className="">Loading...</p>;

  if (error) return <p className="">Some error occured!</p>;

  if (user) return router.replace('/');

  return (
    <main className="w-full h-[100dvh] h-[100vh] flex justify-center items-center">
      <AuthCard />
    </main>
  );
}
