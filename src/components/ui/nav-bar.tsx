'use client';

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { User } from 'next-auth';

function Navbar() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <nav className="p-4 bg-gradient-to-r from-blue-950 to-violet-900 text-indigo-200 shadow-lg shadow-indigo-500 sm:p-6">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
        <a href="#" className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-4 sm:mb-0">
          Anonymous Feedback
        </a>
        {session ? (
          <div className="flex flex-col sm:flex-col items-center space-y-3  sm:space-y-0 sm:space-x-4">
            <span className="text-sm sm:text-base text-indigo-200">
              Welcome, {user.username || user.email}
            </span>
            <Button
              onClick={() => signOut()}
              className="w-full sm:w-auto bg-white text-indigo-900 hover:bg-indigo-100 transition-colors duration-200 font-semibold"
              variant="outline"
            >
              Logout
            </Button>
          </div>
        ) : (
          <Link href="/sign-in">
            <Button
              className="w-full sm:w-auto bg-white text-indigo-900 hover:bg-indigo-100 transition-colors duration-200 font-semibold"
              
            >
              Login
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;