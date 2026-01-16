'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';

import { jobsApi, applicationsApi, type ApplicationData } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';

function formatSalary(min: number | null, max: number | null, currency: string): string {
  if (!min && !max) return 'Not specified';
  const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 });
  if (min && max) return `${formatter.format(min)} - ${formatter.format(max)}`;
  if (min) return `From ${formatter.format(min)}`;
  if (max) return `Up to ${formatter.format(max)}`;
  return 'Not specified';
}

function ApplicationModal({
  isOpen,
  onClose,
  jobId,
  jobTitle,
}: {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  jobTitle: string;
}) {
  const [formData, setFormData] = useState<ApplicationData>({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    coverLetter: '',
    linkedinUrl: '',
    portfolioUrl: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ trackingToken: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await applicationsApi.apply(jobId, formData);
      setSuccess({ trackingToken: result.trackingToken });
    } catch (err: any) {
      setError(err.message || 'Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        {success ? (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Application Submitted!</h3>
            <p className="mt-2 text-gray-600">
              Your application for <strong>{jobTitle}</strong> has been submitted successfully.
            </p>
            <p className="mt-4 text-sm text-gray-500">
              Tracking Token: <code className="rounded bg-gray-100 px-2 py-1">{success.trackingToken}</code>
            </p>
            <p className="mt-2 text-xs text-gray-400">
              Save this token to check your application status later.
            </p>
            <button
              onClick={onClose}
              className="mt-6 w-full rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-500"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Apply for {jobTitle}</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {error && (
              <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Cover Letter</label>
                <textarea
                  rows={4}
                  value={formData.coverLetter}
                  onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Tell us why you're a great fit for this position..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">LinkedIn URL</label>
                <input
                  type="url"
                  value={formData.linkedinUrl}
                  onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Portfolio URL</label>
                <input
                  type="url"
                  value={formData.portfolioUrl}
                  onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="https://yourportfolio.com"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function JobDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [showApplyModal, setShowApplyModal] = useState(false);

  const { data: job, isLoading, error } = useQuery({
    queryKey: ['job', slug],
    queryFn: () => jobsApi.getBySlug(slug),
    enabled: !!slug,
  });

  const { data: similarJobs } = useQuery({
    queryKey: ['similar-jobs', job?.id],
    queryFn: () => jobsApi.getSimilar(job!.id),
    enabled: !!job?.id,
  });

  // Track view
  useEffect(() => {
    if (job?.id) {
      jobsApi.trackView(job.id).catch(() => {});
    }
  }, [job?.id]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-900">Job Not Found</h1>
        <p className="mt-2 text-gray-600">The job you&apos;re looking for doesn&apos;t exist or has expired.</p>
        <Link href="/jobs" className="mt-4 text-indigo-600 hover:text-indigo-500">
          Browse all jobs
        </Link>
      </div>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <Link href="/jobs" className="mb-6 inline-flex items-center text-sm text-gray-600 hover:text-indigo-600">
            <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Jobs
          </Link>

          {/* Job Header */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{job.title}</h1>
                <p className="mt-2 text-lg text-gray-600">{job.organization.name}</p>
                <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-500">
                  {job.location && (
                    <span className="flex items-center gap-1">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {job.location.name}
                    </span>
                  )}
                  <span className="rounded-full bg-gray-100 px-3 py-1 font-medium">
                    {job.employmentType.replace('_', ' ')}
                  </span>
                  {job.remoteOption !== 'ON_SITE' && (
                    <span className="rounded-full bg-green-100 px-3 py-1 font-medium text-green-700">
                      {job.remoteOption}
                    </span>
                  )}
                  {job.experienceLevel && (
                    <span className="rounded-full bg-blue-100 px-3 py-1 font-medium text-blue-700">
                      {job.experienceLevel}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setShowApplyModal(true)}
                className="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white shadow transition hover:bg-indigo-500"
              >
                Apply Now
              </button>
            </div>

            {/* Salary */}
            {(job.salaryMin || job.salaryMax) && (
              <div className="mt-6 rounded-lg bg-gray-50 p-4">
                <p className="text-sm text-gray-500">Salary</p>
                <p className="text-xl font-semibold text-gray-900">
                  {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}
                  {job.salaryPeriod && <span className="text-sm font-normal text-gray-500"> / {job.salaryPeriod.toLowerCase()}</span>}
                </p>
              </div>
            )}
          </div>

          {/* Job Content */}
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              {/* Description */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900">Job Description</h2>
                <div
                  className="prose prose-gray mt-4 max-w-none"
                  dangerouslySetInnerHTML={{ __html: job.description }}
                />
              </div>

              {/* Requirements */}
              {job.requirements && (
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-gray-900">Requirements</h2>
                  <div
                    className="prose prose-gray mt-4 max-w-none"
                    dangerouslySetInnerHTML={{ __html: job.requirements }}
                  />
                </div>
              )}

              {/* Benefits */}
              {job.benefits && (
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-gray-900">Benefits</h2>
                  <div
                    className="prose prose-gray mt-4 max-w-none"
                    dangerouslySetInnerHTML={{ __html: job.benefits }}
                  />
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Company Info */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900">About the Company</h2>
                <div className="mt-4">
                  <p className="font-medium text-gray-900">{job.organization.name}</p>
                  {job.organization.industry && (
                    <p className="mt-1 text-sm text-gray-500">{job.organization.industry}</p>
                  )}
                </div>
              </div>

              {/* Job Info */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900">Job Information</h2>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Posted</dt>
                    <dd className="text-gray-900">{new Date(job.publishedAt).toLocaleDateString()}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Expires</dt>
                    <dd className="text-gray-900">{new Date(job.expiresAt).toLocaleDateString()}</dd>
                  </div>
                  {job.category && (
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Category</dt>
                      <dd className="text-gray-900">{job.category.name}</dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Views</dt>
                    <dd className="text-gray-900">{job.viewCount}</dd>
                  </div>
                </dl>
              </div>

              {/* Apply Button */}
              <button
                onClick={() => setShowApplyModal(true)}
                className="w-full rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white shadow transition hover:bg-indigo-500"
              >
                Apply Now
              </button>
            </div>
          </div>

          {/* Similar Jobs */}
          {similarJobs && similarJobs.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-semibold text-gray-900">Similar Jobs</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {similarJobs.map((similarJob) => (
                  <Link
                    key={similarJob.id}
                    href={`/jobs/${similarJob.slug}`}
                    className="rounded-lg border border-gray-200 bg-white p-4 transition hover:border-indigo-300 hover:shadow-md"
                  >
                    <h3 className="font-semibold text-gray-900">{similarJob.title}</h3>
                    <p className="mt-1 text-sm text-gray-600">{similarJob.organization.name}</p>
                    {similarJob.location && (
                      <p className="mt-2 text-sm text-gray-500">{similarJob.location.name}</p>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <ApplicationModal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        jobId={job.id}
        jobTitle={job.title}
      />
    </>
  );
}
