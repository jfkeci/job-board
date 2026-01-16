'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { useAuthStore } from '@/store/auth.store';
import { myApplicationsApi, applicationsApi, type MyApplication, type ApplicationStatus } from '@/lib/api';

// Status badge colors
const statusColors: Record<string, { bg: string; text: string }> = {
  PENDING: { bg: 'bg-blue-100', text: 'text-blue-700' },
  REVIEWED: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  SHORTLISTED: { bg: 'bg-purple-100', text: 'text-purple-700' },
  INTERVIEW: { bg: 'bg-indigo-100', text: 'text-indigo-700' },
  OFFERED: { bg: 'bg-green-100', text: 'text-green-700' },
  HIRED: { bg: 'bg-green-200', text: 'text-green-800' },
  REJECTED: { bg: 'bg-red-100', text: 'text-red-700' },
  WITHDRAWN: { bg: 'bg-gray-100', text: 'text-gray-700' },
};

const statusLabels: Record<string, string> = {
  PENDING: 'Submitted',
  REVIEWED: 'Under Review',
  SHORTLISTED: 'Shortlisted',
  INTERVIEW: 'Interview',
  OFFERED: 'Offer Received',
  HIRED: 'Hired',
  REJECTED: 'Not Selected',
  WITHDRAWN: 'Withdrawn',
};

export default function ApplicationsPage() {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAuthStore();
  const [trackingCode, setTrackingCode] = useState('');
  const [trackingResult, setTrackingResult] = useState<ApplicationStatus | null>(null);
  const [trackingError, setTrackingError] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState(false);

  // Fetch user's applications
  const { data, isLoading } = useQuery({
    queryKey: ['my-applications'],
    queryFn: () => myApplicationsApi.getMyApplications(),
    enabled: isAuthenticated,
  });

  const applications = data?.data || [];

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.push('/login?redirect=/applications');
    }
  }, [isAuthenticated, isHydrated, router]);

  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingCode.trim()) return;

    setIsTracking(true);
    setTrackingError(null);
    setTrackingResult(null);

    try {
      const result = await applicationsApi.checkStatus(trackingCode.trim());
      setTrackingResult(result);
    } catch (err: any) {
      setTrackingError(err.message || 'Application not found');
    } finally {
      setIsTracking(false);
    }
  };

  if (!isHydrated || !isAuthenticated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
        <p className="mt-2 text-gray-600">Track the status of your job applications</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
        </div>
      ) : applications.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
          <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-semibold text-gray-900">No applications yet</h3>
          <p className="mt-2 text-gray-600">Start applying to jobs and track your progress here.</p>
          <Link
            href="/jobs"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-500"
          >
            Browse Jobs
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((application: MyApplication) => {
            const colors = statusColors[application.status] || statusColors.PENDING;
            const label = statusLabels[application.status] || application.status;

            return (
              <div
                key={application.id}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-indigo-300 hover:shadow-md"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <Link
                      href={`/jobs/${application.job.slug}`}
                      className="text-lg font-semibold text-gray-900 hover:text-indigo-600"
                    >
                      {application.job.title}
                    </Link>
                    <p className="mt-1 text-sm text-gray-600">{application.job.organization.name}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className={`rounded-full px-3 py-1 text-sm font-medium ${colors.bg} ${colors.text}`}>
                      {label}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                  <span className="text-sm text-gray-500">
                    Applied {new Date(application.createdAt).toLocaleDateString()}
                  </span>
                  <Link
                    href={`/jobs/${application.job.slug}`}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    View Job
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Anonymous Application Tracker */}
      <div className="mt-12 rounded-2xl border border-gray-200 bg-gray-50 p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-gray-900">Track Anonymous Application</h2>
        <p className="mt-2 text-sm text-gray-600">
          Applied without an account? Enter your tracking code to check the status.
        </p>

        <form onSubmit={handleTrackSubmit} className="mt-4 flex gap-3">
          <input
            type="text"
            value={trackingCode}
            onChange={(e) => setTrackingCode(e.target.value)}
            placeholder="Enter tracking code"
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />
          <button
            type="submit"
            disabled={isTracking || !trackingCode.trim()}
            className="rounded-lg bg-gray-900 px-6 py-2 font-medium text-white transition hover:bg-gray-800 disabled:opacity-50"
          >
            {isTracking ? 'Tracking...' : 'Track'}
          </button>
        </form>

        {trackingError && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {trackingError}
          </div>
        )}

        {trackingResult && (
          <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4">
            <h3 className="font-semibold text-gray-900">{trackingResult.jobTitle}</h3>
            <p className="text-sm text-gray-600">{trackingResult.organizationName}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-sm text-gray-500">Status:</span>
              <span
                className={`rounded-full px-3 py-1 text-sm font-medium ${
                  statusColors[trackingResult.status]?.bg || 'bg-gray-100'
                } ${statusColors[trackingResult.status]?.text || 'text-gray-700'}`}
              >
                {statusLabels[trackingResult.status] || trackingResult.status}
              </span>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Submitted: {new Date(trackingResult.submittedAt).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
