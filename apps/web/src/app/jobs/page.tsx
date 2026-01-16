'use client';

import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect, Suspense } from 'react';

import { jobsApi, categoriesApi, locationsApi, type JobSearchParams, type PublicJobListItem } from '@/lib/api';

function formatSalary(min: number | null, max: number | null, currency: string): string {
  if (!min && !max) return '';
  const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 });
  if (min && max) return `${formatter.format(min)} - ${formatter.format(max)}`;
  if (min) return `From ${formatter.format(min)}`;
  if (max) return `Up to ${formatter.format(max)}`;
  return '';
}

function JobCard({ job }: { job: PublicJobListItem }) {
  const isFeatured = job.promotions.includes('FEATURED') || job.tier === 'PREMIUM';
  const isHighlighted = job.promotions.includes('HIGHLIGHTED') || job.tier === 'STANDARD';

  return (
    <div
      className={`group relative rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md ${
        isFeatured
          ? 'border-indigo-300 ring-2 ring-indigo-100'
          : isHighlighted
            ? 'border-indigo-200'
            : 'border-gray-200 hover:border-indigo-300'
      }`}
    >
      {/* Badges */}
      <div className="absolute right-4 top-4 flex gap-2">
        {isFeatured && (
          <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
            Featured
          </span>
        )}
      </div>

      {/* Content */}
      <div className="pr-20">
        <Link href={`/jobs/${job.slug}`}>
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600">
            {job.title}
          </h3>
        </Link>
        <p className="mt-1 text-sm font-medium text-gray-600">{job.organization.name}</p>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-gray-500">
        {job.location && (
          <span className="flex items-center gap-1">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {job.location.name}
          </span>
        )}
        <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
          {job.employmentType.replace('_', ' ')}
        </span>
        {job.remoteOption !== 'ON_SITE' && (
          <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
            {job.remoteOption}
          </span>
        )}
      </div>

      {(job.salaryMin || job.salaryMax) && (
        <p className="mt-3 text-sm font-medium text-gray-900">
          {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}
        </p>
      )}

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-gray-400">
          {new Date(job.publishedAt).toLocaleDateString()}
        </span>
        <Link
          href={`/jobs/${job.slug}`}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

function SearchFilters({
  params,
  onParamsChange,
}: {
  params: JobSearchParams;
  onParamsChange: (params: JobSearchParams) => void;
}) {
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAll(),
  });

  const { data: locationsData } = useQuery({
    queryKey: ['locations'],
    queryFn: () => locationsApi.getAll(),
  });

  const [searchQuery, setSearchQuery] = useState(params.q || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onParamsChange({ ...params, q: searchQuery, page: 1 });
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <form onSubmit={handleSearch} className="space-y-4">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700">
            Search
          </label>
          <input
            type="text"
            id="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Job title, keywords..."
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="category"
            value={params.categoryId || ''}
            onChange={(e) => onParamsChange({ ...params, categoryId: e.target.value || undefined, page: 1 })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">All Categories</option>
            {categoriesData?.data.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <select
            id="location"
            value={params.locationId || ''}
            onChange={(e) => onParamsChange({ ...params, locationId: e.target.value || undefined, page: 1 })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">All Locations</option>
            {locationsData?.data.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="employmentType" className="block text-sm font-medium text-gray-700">
            Employment Type
          </label>
          <select
            id="employmentType"
            value={params.employmentType || ''}
            onChange={(e) => onParamsChange({ ...params, employmentType: e.target.value || undefined, page: 1 })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">All Types</option>
            <option value="FULL_TIME">Full Time</option>
            <option value="PART_TIME">Part Time</option>
            <option value="CONTRACT">Contract</option>
            <option value="FREELANCE">Freelance</option>
            <option value="INTERNSHIP">Internship</option>
          </select>
        </div>

        <div>
          <label htmlFor="remoteOption" className="block text-sm font-medium text-gray-700">
            Remote
          </label>
          <select
            id="remoteOption"
            value={params.remoteOption || ''}
            onChange={(e) => onParamsChange({ ...params, remoteOption: e.target.value || undefined, page: 1 })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Any</option>
            <option value="ON_SITE">On Site</option>
            <option value="REMOTE">Remote</option>
            <option value="HYBRID">Hybrid</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white transition hover:bg-indigo-500"
        >
          Search
        </button>
      </form>
    </div>
  );
}

function JobsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [params, setParams] = useState<JobSearchParams>(() => ({
    q: searchParams.get('q') || undefined,
    categoryId: searchParams.get('categoryId') || undefined,
    locationId: searchParams.get('locationId') || undefined,
    employmentType: searchParams.get('employmentType') || undefined,
    remoteOption: searchParams.get('remoteOption') || undefined,
    page: parseInt(searchParams.get('page') || '1', 10),
    limit: 20,
  }));

  const { data, isLoading, error } = useQuery({
    queryKey: ['jobs', params],
    queryFn: () => jobsApi.search(params),
  });

  // Update URL when params change
  useEffect(() => {
    const query = new URLSearchParams();
    if (params.q) query.set('q', params.q);
    if (params.categoryId) query.set('categoryId', params.categoryId);
    if (params.locationId) query.set('locationId', params.locationId);
    if (params.employmentType) query.set('employmentType', params.employmentType);
    if (params.remoteOption) query.set('remoteOption', params.remoteOption);
    if (params.page && params.page > 1) query.set('page', params.page.toString());

    const queryString = query.toString();
    router.replace(`/jobs${queryString ? `?${queryString}` : ''}`, { scroll: false });
  }, [params, router]);

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Find Jobs</h1>
          <p className="mt-2 text-gray-600">
            {data?.total ? `${data.total} jobs found` : 'Search for your next opportunity'}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-4">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <SearchFilters params={params} onParamsChange={setParams} />
          </div>

          {/* Job Listings */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
              </div>
            ) : error ? (
              <div className="rounded-lg bg-red-50 p-6 text-center text-red-600">
                Failed to load jobs. Please try again.
              </div>
            ) : data?.data.length === 0 ? (
              <div className="rounded-lg bg-gray-100 p-12 text-center">
                <p className="text-lg text-gray-600">No jobs found matching your criteria.</p>
                <button
                  onClick={() => setParams({ page: 1, limit: 20 })}
                  className="mt-4 text-indigo-600 hover:text-indigo-500"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid gap-6">
                  {data?.data.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>

                {/* Pagination */}
                {data && data.totalPages > 1 && (
                  <div className="mt-8 flex justify-center gap-2">
                    <button
                      onClick={() => setParams({ ...params, page: (params.page || 1) - 1 })}
                      disabled={params.page === 1}
                      className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <span className="flex items-center px-4 text-sm text-gray-600">
                      Page {params.page} of {data.totalPages}
                    </span>
                    <button
                      onClick={() => setParams({ ...params, page: (params.page || 1) + 1 })}
                      disabled={params.page === data.totalPages}
                      className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <JobsPageContent />
    </Suspense>
  );
}
