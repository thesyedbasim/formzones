'use client';

import { auth } from '@/lib/firebase/auth';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dispatch, SetStateAction, useState } from 'react';
import GoogleIcon from './oauth-icons/GoogleIcon';

export default function AuthCard() {
  const [authType, setAuthType] = useState<'login' | 'signup'>('login');

  return authType === 'login' ? (
    <AuthLoginCard setAuthType={setAuthType} />
  ) : (
    <AuthSignupCard setAuthType={setAuthType} />
  );
}

function AuthLoginCard({
  setAuthType,
}: {
  setAuthType: Dispatch<SetStateAction<'login' | 'signup'>>;
}) {
  const provider = new GoogleAuthProvider();

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      console.log('user logged in using google', user);

      const res = await axios.post('/api/auth/create-user', {
        userUid: user.uid,
      });
    } catch (err) {}
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Login to your Formzones account</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="hello@example.com" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col justify-between">
        <Button className="w-full">Login</Button>
        <p className="text-sm text-muted-foreground mt-2">
          Don&lsquo;t have Formzones account?{' '}
          <span
            onClick={() => setAuthType('signup')}
            className="text-blue-500 underline cursor-pointer"
          >
            Click here
          </span>{' '}
          to create a new account.
        </p>
        <div className="flex flex-col space-y-1.5 w-full mt-6">
          <Button
            onClick={() => {
              signInWithGoogle();
            }}
          >
            <GoogleIcon /> Login with Google
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

function AuthSignupCard({
  setAuthType,
}: {
  setAuthType: Dispatch<SetStateAction<'login' | 'signup'>>;
}) {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Create a new account</CardTitle>
        <CardDescription>Sign up for a new Formzones account</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="hello@example.com" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="confirm-password">Confirm password</Label>
              <Input id="confirm-password" type="password" />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col justify-between">
        <Button className="w-full">Login</Button>
        <p className="text-sm text-muted-foreground mt-2">
          Already have Formzones account?{' '}
          <span
            onClick={() => setAuthType('login')}
            className="text-blue-500 underline cursor-pointer"
          >
            Click here
          </span>{' '}
          to login.
        </p>
      </CardFooter>
    </Card>
  );
}
