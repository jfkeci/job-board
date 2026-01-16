import Link from 'next/link';

import { env } from '@/lib/env';

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-indigo-600">
                job-board
              </span>
              <span className="text-xl font-light text-gray-700">Jobs</span>
            </Link>
            <p className="mt-4 text-sm text-gray-500">
              Find your next career opportunity with thousands of jobs from top
              companies.
            </p>
          </div>

          {/* For Job Seekers */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              For Job Seekers
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="/jobs"
                  className="text-sm text-gray-600 transition hover:text-indigo-600"
                >
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link
                  href="/companies"
                  className="text-sm text-gray-600 transition hover:text-indigo-600"
                >
                  Companies
                </Link>
              </li>
              <li>
                <Link
                  href="/profile"
                  className="text-sm text-gray-600 transition hover:text-indigo-600"
                >
                  My Profile
                </Link>
              </li>
              <li>
                <Link
                  href="/applications"
                  className="text-sm text-gray-600 transition hover:text-indigo-600"
                >
                  My Applications
                </Link>
              </li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              For Employers
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href={env.NEXT_PUBLIC_DASHBOARD_URL}
                  className="text-sm text-gray-600 transition hover:text-indigo-600"
                >
                  Post a Job
                </Link>
              </li>
              <li>
                <Link
                  href={env.NEXT_PUBLIC_DASHBOARD_URL}
                  className="text-sm text-gray-600 transition hover:text-indigo-600"
                >
                  Employer Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-sm text-gray-600 transition hover:text-indigo-600"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Support</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="/help"
                  className="text-sm text-gray-600 transition hover:text-indigo-600"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-gray-600 transition hover:text-indigo-600"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-gray-600 transition hover:text-indigo-600"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-gray-600 transition hover:text-indigo-600"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} job-board Jobs. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
