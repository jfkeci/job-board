'use client';

import Link from 'next/link';
import { useState } from 'react';

import { useAuthStore } from '@/store/auth.store';

export function Header() {
  const { isAuthenticated, isHydrated, user, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-indigo-600">
              job-board
            </span>
            <span className="text-2xl font-light text-gray-700">Jobs</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="/jobs"
              className="text-sm font-medium text-gray-600 transition hover:text-indigo-600"
            >
              Find Jobs
            </Link>
            <Link
              href="/companies"
              className="text-sm font-medium text-gray-600 transition hover:text-indigo-600"
            >
              Companies
            </Link>

            {isHydrated && (
              <>
                {isAuthenticated ? (
                  <div className="flex items-center gap-4">
                    <Link
                      href="/profile"
                      className="text-sm font-medium text-gray-600 transition hover:text-indigo-600"
                    >
                      My Profile
                    </Link>
                    <Link
                      href="/applications"
                      className="text-sm font-medium text-gray-600 transition hover:text-indigo-600"
                    >
                      Applications
                    </Link>
                    <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
                      <span className="text-sm text-gray-500">
                        {user?.email}
                      </span>
                      <button
                        onClick={handleLogout}
                        className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Link
                      href="/login"
                      className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 md:hidden"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="border-t border-gray-200 py-4 md:hidden">
            <div className="flex flex-col gap-3">
              <Link
                href="/jobs"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
              >
                Find Jobs
              </Link>
              <Link
                href="/companies"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
              >
                Companies
              </Link>

              {isHydrated && (
                <>
                  {isAuthenticated ? (
                    <>
                      <Link
                        href="/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
                      >
                        My Profile
                      </Link>
                      <Link
                        href="/applications"
                        onClick={() => setMobileMenuOpen(false)}
                        className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
                      >
                        Applications
                      </Link>
                      <div className="border-t border-gray-200 pt-3">
                        <span className="block px-3 py-1 text-sm text-gray-500">
                          {user?.email}
                        </span>
                        <button
                          onClick={handleLogout}
                          className="mt-2 w-full rounded-lg bg-gray-100 px-3 py-2 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-200"
                        >
                          Logout
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col gap-2 border-t border-gray-200 pt-3">
                      <Link
                        href="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="rounded-lg px-3 py-2 text-center text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setMobileMenuOpen(false)}
                        className="rounded-lg bg-indigo-600 px-3 py-2 text-center text-sm font-medium text-white transition hover:bg-indigo-500"
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
