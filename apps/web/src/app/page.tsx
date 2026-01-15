import Link from 'next/link';

// ============================================================================
// Types
// ============================================================================

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  description: string;
  postedAt: string;
  isNew?: boolean;
  isFeatured?: boolean;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  jobCount: number;
  slug: string;
}

interface Benefit {
  id: string;
  title: string;
  description: string;
  icon: string;
}

// ============================================================================
// Mock Data
// ============================================================================

const FEATURED_JOBS: Job[] = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    company: 'TechCorp Solutions',
    location: 'Zagreb, Croatia',
    type: 'Full-time',
    description:
      'Join our engineering team to build scalable web applications using modern technologies.',
    postedAt: '2 days ago',
    isNew: true,
    isFeatured: true,
  },
  {
    id: '2',
    title: 'Marketing Manager',
    company: 'Growth Agency',
    location: 'Ljubljana, Slovenia',
    type: 'Full-time',
    description:
      'Lead our marketing initiatives and drive brand awareness across digital channels.',
    postedAt: '3 days ago',
    isFeatured: true,
  },
  {
    id: '3',
    title: 'UX/UI Designer',
    company: 'Design Studio Pro',
    location: 'Remote',
    type: 'Remote',
    description:
      'Create beautiful user experiences for our growing portfolio of digital products.',
    postedAt: '1 day ago',
    isNew: true,
    isFeatured: true,
  },
  {
    id: '4',
    title: 'Financial Analyst',
    company: 'FinServe Group',
    location: 'Belgrade, Serbia',
    type: 'Full-time',
    description:
      'Analyze financial data and provide strategic insights to drive business decisions.',
    postedAt: '4 days ago',
    isFeatured: true,
  },
  {
    id: '5',
    title: 'Customer Success Manager',
    company: 'SaaS Platform Inc',
    location: 'Sarajevo, Bosnia',
    type: 'Full-time',
    description:
      'Build lasting relationships with customers and ensure their success with our platform.',
    postedAt: '1 week ago',
    isFeatured: true,
  },
  {
    id: '6',
    title: 'DevOps Engineer',
    company: 'CloudScale Systems',
    location: 'Remote',
    type: 'Contract',
    description:
      'Manage cloud infrastructure and implement CI/CD pipelines for our microservices.',
    postedAt: '5 days ago',
    isFeatured: true,
  },
];

const CATEGORIES: Category[] = [
  { id: '1', name: 'Technology', icon: '💻', jobCount: 245, slug: 'technology' },
  {
    id: '2',
    name: 'Marketing & Sales',
    icon: '📊',
    jobCount: 128,
    slug: 'marketing-sales',
  },
  {
    id: '3',
    name: 'Finance',
    icon: '💰',
    jobCount: 89,
    slug: 'finance',
  },
  {
    id: '4',
    name: 'Healthcare',
    icon: '🏥',
    jobCount: 156,
    slug: 'healthcare',
  },
  {
    id: '5',
    name: 'Education',
    icon: '📚',
    jobCount: 67,
    slug: 'education',
  },
  {
    id: '6',
    name: 'Engineering',
    icon: '⚙️',
    jobCount: 112,
    slug: 'engineering',
  },
  {
    id: '7',
    name: 'Customer Service',
    icon: '🎧',
    jobCount: 94,
    slug: 'customer-service',
  },
  {
    id: '8',
    name: 'Human Resources',
    icon: '👥',
    jobCount: 43,
    slug: 'human-resources',
  },
];

const BENEFITS: Benefit[] = [
  {
    id: '1',
    title: 'Free Access',
    description: 'Browse all job listings completely free with no hidden fees.',
    icon: '🆓',
  },
  {
    id: '2',
    title: 'Easy Apply',
    description: 'Apply to jobs with just a few clicks using your saved profile.',
    icon: '⚡',
  },
  {
    id: '3',
    title: 'Get Discovered',
    description: 'Make your profile visible to top employers actively hiring.',
    icon: '👀',
  },
  {
    id: '4',
    title: 'Job Alerts',
    description: 'Get notified instantly when new jobs match your preferences.',
    icon: '🔔',
  },
];

const POPULAR_SEARCHES = ['IT', 'Marketing', 'Sales', 'Remote', 'Finance', 'Design'];

// ============================================================================
// Components
// ============================================================================

function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Find Your Next
            <span className="block text-indigo-200">Career Opportunity</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-indigo-100 sm:text-xl">
            Discover thousands of job opportunities from top companies across the
            region. Your dream job is just a search away.
          </p>

          {/* Search Bar */}
          <div className="mx-auto mt-10 max-w-3xl">
            <form className="flex flex-col gap-3 sm:flex-row">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Job title, keywords, or company"
                  className="w-full rounded-lg border-0 px-4 py-3 text-gray-900 placeholder-gray-500 shadow-lg focus:ring-2 focus:ring-indigo-300"
                />
              </div>
              <div className="sm:w-48">
                <input
                  type="text"
                  placeholder="Location"
                  className="w-full rounded-lg border-0 px-4 py-3 text-gray-900 placeholder-gray-500 shadow-lg focus:ring-2 focus:ring-indigo-300"
                />
              </div>
              <button
                type="submit"
                className="rounded-lg bg-indigo-500 px-8 py-3 font-semibold text-white shadow-lg transition hover:bg-indigo-400 focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2"
              >
                Search Jobs
              </button>
            </form>
          </div>

          {/* Popular Searches */}
          <div className="mt-8">
            <span className="text-sm text-indigo-200">Popular: </span>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              {POPULAR_SEARCHES.map((term) => (
                <Link
                  key={term}
                  href={`/jobs?q=${term.toLowerCase()}`}
                  className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur transition hover:bg-white/20"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function JobCard({ job }: { job: Job }) {
  return (
    <div className="group relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-indigo-300 hover:shadow-md">
      {/* Badges */}
      <div className="absolute right-4 top-4 flex gap-2">
        {job.isNew && (
          <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
            New
          </span>
        )}
        {job.isFeatured && (
          <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
            Featured
          </span>
        )}
      </div>

      {/* Content */}
      <div className="pr-20">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600">
          {job.title}
        </h3>
        <p className="mt-1 text-sm font-medium text-gray-600">{job.company}</p>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-gray-500">
        <span className="flex items-center gap-1">
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          {job.location}
        </span>
        <span className="flex items-center gap-1">
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {job.type}
        </span>
      </div>

      <p className="mt-4 line-clamp-2 text-sm text-gray-600">{job.description}</p>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-gray-400">{job.postedAt}</span>
        <Link
          href={`/jobs/${job.id}`}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
}

function FeaturedJobsSection() {
  return (
    <section className="bg-gray-50 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Featured Jobs
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Hand-picked opportunities from leading companies
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED_JOBS.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-8 py-3 font-semibold text-white transition hover:bg-indigo-500"
          >
            View All Jobs
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/jobs?category=${category.slug}`}
      className="group flex flex-col items-center rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm transition hover:border-indigo-300 hover:shadow-md"
    >
      <span className="text-4xl">{category.icon}</span>
      <h3 className="mt-4 font-semibold text-gray-900 group-hover:text-indigo-600">
        {category.name}
      </h3>
      <p className="mt-1 text-sm text-gray-500">{category.jobCount}+ jobs</p>
    </Link>
  );
}

function CategoriesSection() {
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Browse by Category
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Explore opportunities across different industries and sectors
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-6">
          {CATEGORIES.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BenefitCard({ benefit }: { benefit: Benefit }) {
  return (
    <div className="rounded-xl bg-white p-6 text-center shadow-sm">
      <span className="text-4xl">{benefit.icon}</span>
      <h3 className="mt-4 text-lg font-semibold text-gray-900">{benefit.title}</h3>
      <p className="mt-2 text-sm text-gray-600">{benefit.description}</p>
    </div>
  );
}

function WhyChooseUsSection() {
  return (
    <section className="bg-gradient-to-br from-gray-50 to-indigo-50 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Why Choose Us
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            We make your job search simple, fast, and effective
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((benefit) => (
            <BenefitCard key={benefit.id} benefit={benefit} />
          ))}
        </div>
      </div>
    </section>
  );
}

function EmployerCTASection() {
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl bg-indigo-700 shadow-xl">
          <div className="px-6 py-12 sm:px-12 lg:flex lg:items-center lg:justify-between lg:px-16 lg:py-16">
            <div>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Looking to Hire?
              </h2>
              <p className="mt-3 max-w-xl text-lg text-indigo-100">
                Reach thousands of qualified candidates and find your next great
                hire. Post your job today and start receiving applications.
              </p>
            </div>
            <div className="mt-8 lg:mt-0 lg:ml-8 lg:flex-shrink-0">
              <Link
                href="http://localhost:3002"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 font-semibold text-indigo-600 shadow transition hover:bg-indigo-50"
              >
                Post a Job
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// Page
// ============================================================================

export default function Home() {
  return (
    <main>
      <HeroSection />
      <FeaturedJobsSection />
      <CategoriesSection />
      <WhyChooseUsSection />
      <EmployerCTASection />
    </main>
  );
}
