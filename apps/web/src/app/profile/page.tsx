'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { useAuthStore } from '@/store/auth.store';
import { profilesApi, type UpdateProfileData } from '@/lib/api';

export default function ProfilePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated, isHydrated, user, fetchProfile } = useAuthStore();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [headline, setHeadline] = useState('');
  const [summary, setSummary] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fetch profile data
  const { data: meData, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['profile', 'me'],
    queryFn: () => profilesApi.getMe(),
    enabled: isAuthenticated,
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateProfileData) => profilesApi.updateProfile(data),
    onSuccess: () => {
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      fetchProfile();
    },
    onError: (error: Error) => {
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
    },
  });

  // Populate form when profile data is loaded
  useEffect(() => {
    if (meData?.profile) {
      setFirstName(meData.profile.firstName || '');
      setLastName(meData.profile.lastName || '');
      setPhone(meData.profile.phone || '');
      setHeadline(meData.profile.headline || '');
      setSummary(meData.profile.summary || '');
    }
  }, [meData]);

  // Redirect if not authenticated
  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.push('/login?redirect=/profile');
    }
  }, [isAuthenticated, isHydrated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    updateProfileMutation.mutate({
      firstName: firstName.trim() || undefined,
      lastName: lastName.trim() || undefined,
      phone: phone.trim() || undefined,
      headline: headline.trim() || undefined,
      summary: summary.trim() || undefined,
    });
  };

  if (!isHydrated || !isAuthenticated || isLoadingProfile) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="mt-2 text-gray-600">Manage your profile information and settings</p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {message && (
            <div
              className={`rounded-lg border p-4 ${
                message.type === 'success'
                  ? 'border-green-200 bg-green-50 text-green-700'
                  : 'border-red-200 bg-red-50 text-red-700'
              }`}
            >
              <p className="text-sm">{message.text}</p>
            </div>
          )}

          {/* Email (read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              value={user?.email || meData?.email || ''}
              disabled
              className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-500"
            />
            <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
          </div>

          {/* Name */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          {/* Headline */}
          <div>
            <label htmlFor="headline" className="block text-sm font-medium text-gray-700">
              Professional Headline
            </label>
            <input
              id="headline"
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              placeholder="e.g., Senior Software Engineer at TechCorp"
            />
          </div>

          {/* Summary/Bio */}
          <div>
            <label htmlFor="summary" className="block text-sm font-medium text-gray-700">
              Professional Summary
            </label>
            <textarea
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={4}
              className="mt-1 w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              placeholder="Tell employers a bit about yourself..."
            />
          </div>

          {/* CV Upload - placeholder for future implementation */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Resume / CV</label>
            <div className="mt-1 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 px-6 py-8 transition hover:border-indigo-400">
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="mt-2 text-sm text-gray-600">
                  CV upload coming soon
                </p>
                <p className="mt-1 text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={updateProfileMutation.isPending}
              className="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
