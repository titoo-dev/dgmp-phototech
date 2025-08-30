"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface User {
  id: string;
  email: string;
  name?: string;
}

const HomePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/api/auth/session");
        if (response.ok) {
          const session = await response.json();
          if (session.user) {
            setUser(session.user);
          }
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="text-center sm:text-left">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to PhotoTech
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your modern photography technology platform
          </p>
        </div>

        {isLoading ? (
          <div className="text-lg">Loading...</div>
        ) : user ? (
          <div className="flex gap-4 items-center flex-col sm:flex-row">
            <Link
              href="/dashboard"
              className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            >
              Go to Dashboard
            </Link>
            <p className="text-sm text-gray-600">
              Welcome back, {user.name || user.email}!
            </p>
          </div>
        ) : (
          <div className="flex gap-4 items-center flex-col sm:flex-row">
            <Link
              href="/auth/signin"
              className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            >
              Sign Up
            </Link>
          </div>
        )}

        <div className="mt-8 text-center sm:text-left">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Features
          </h2>
          <ul className="space-y-2 text-gray-600">
            <li>• Secure authentication with Better Auth</li>
            <li>• Social login with Google and GitHub</li>
            <li>• Protected dashboard for authenticated users</li>
            <li>• Modern UI with Tailwind CSS</li>
            <li>• Built with Next.js and TypeScript</li>
          </ul>
        </div>
      </main>
      
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn Next.js
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://better-auth.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Better Auth Docs
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          View on GitHub
        </a>
      </footer>
    </div>
  );
};

export default HomePage;
