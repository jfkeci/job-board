import type { User } from '@borg/types';

export default function Dashboard() {
  // Example usage of shared types
  const currentUser: User = {
    id: 'admin-1',
    email: 'admin@company.com',
    name: 'Admin User',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-primary-600">Borg Dashboard</h1>
          <p className="text-sm text-gray-500">B2B Portal</p>
        </div>
        <nav className="space-y-2">
          <button
            type="button"
            className="block w-full rounded-lg bg-primary-50 px-4 py-2 text-left text-primary-700 dark:bg-primary-900/20 dark:text-primary-400"
          >
            Overview
          </button>
          <button
            type="button"
            className="block w-full rounded-lg px-4 py-2 text-left text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            Analytics
          </button>
          <button
            type="button"
            className="block w-full rounded-lg px-4 py-2 text-left text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            Users
          </button>
          <button
            type="button"
            className="block w-full rounded-lg px-4 py-2 text-left text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            Settings
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="mb-8">
          <h2 className="text-2xl font-semibold">Welcome back, {currentUser.name}</h2>
          <p className="text-gray-500">Here&apos;s what&apos;s happening with your business today.</p>
        </header>

        {/* Stats Grid */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <p className="text-sm text-gray-500">Total Revenue</p>
            <p className="text-2xl font-bold">$45,231</p>
            <p className="text-sm text-green-600">+12.5% from last month</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <p className="text-sm text-gray-500">Active Users</p>
            <p className="text-2xl font-bold">2,350</p>
            <p className="text-sm text-green-600">+8.2% from last month</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <p className="text-sm text-gray-500">Pending Orders</p>
            <p className="text-2xl font-bold">48</p>
            <p className="text-sm text-yellow-600">-2.4% from last month</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <p className="text-sm text-gray-500">Support Tickets</p>
            <p className="text-2xl font-bold">12</p>
            <p className="text-sm text-green-600">-18% from last month</p>
          </div>
        </div>

        {/* User Info Card */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h3 className="mb-4 text-lg font-semibold">Current User (from @borg/types)</h3>
          <pre className="rounded-lg bg-gray-100 p-4 text-sm dark:bg-gray-800">
            {JSON.stringify(currentUser, null, 2)}
          </pre>
        </div>
      </main>
    </div>
  );
}
