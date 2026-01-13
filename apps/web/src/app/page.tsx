import type { User } from '@borg/types';

export default function Home() {
  // Example usage of shared types
  const exampleUser: User = {
    id: '1',
    email: 'example@email.com',
    name: 'Example User',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="mb-8 text-4xl font-bold">MP Clone</h1>
      <p className="mb-4 text-lg text-gray-600">
        Turborepo Monorepo with Next.js + NestJS
      </p>
      <div className="mt-8 rounded-lg bg-gray-100 p-6 dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-semibold">Example User (from @borg/types)</h2>
        <pre className="text-sm">
          {JSON.stringify(exampleUser, null, 2)}
        </pre>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="rounded-lg border p-4">
          <h3 className="font-semibold">Frontend</h3>
          <p className="text-sm text-gray-500">Next.js 15 + Tailwind CSS</p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-semibold">Backend</h3>
          <p className="text-sm text-gray-500">NestJS API on port 3001</p>
        </div>
      </div>
    </main>
  );
}
