---
title: Rework Dashboard Homepage for Employer Portal
id: 18-dashboard-homepage-rework
created: 2026-01-15
updated: 2026-01-15
status: executed
executed_date: 2026-01-15
execution_result: success
deprecated: false
deprecated_reason:
target: frontend
complexity: moderate
tags:
  - dashboard
  - homepage
  - employer
  - b2b
  - job-posting
dependencies: []
blocks: []
related_specs:
  - "[[initial/business-plan]]"
related_planning: []
notes: Current dashboard overview shows generic B2B metrics. Needs to reflect employer job posting management functionality.
---

# Rework Dashboard Homepage for Employer Portal

## Context

The dashboard app (`apps/dashboard`) is the **Employer Dashboard (B2B)** for the job advertisement platform. The current overview page (`apps/dashboard/src/app/(dashboard)/overview/page.tsx`) displays generic B2B metrics like "Total Revenue", "Active Users", "Conversion Rate" - content unrelated to the actual platform purpose.

According to the business plan, the Employer Dashboard should provide:
- Job posting creation and management
- Tier selection and payment processing
- Applicant tracking system (ATS)
- CV database access (tier-dependent)
- Analytics and performance metrics
- Company profile management
- Invoice and billing history

## Goal

Transform the dashboard overview page into a proper **Employer Dashboard Homepage** that:
1. Shows job posting statistics and performance metrics
2. Displays recent applications and activity
3. Provides quick access to key employer actions
4. Shows tier/subscription status and usage

## Current State

**File**: `apps/dashboard/src/app/(dashboard)/overview/page.tsx`

Current implementation shows:
- Generic stats: Total Revenue, Active Users, Conversion Rate, Active Sessions
- Generic recent activity (user signups, payments, reports)
- Generic tasks with progress bars
- Quick actions: Create Report, Invite Team Member, View Analytics

This does not reflect job posting management or recruitment functionality.

## Requirements

### 1. Stats Overview Section

Replace generic stats with employer-relevant metrics:

| Metric | Description |
|--------|-------------|
| **Active Job Posts** | Number of currently live job listings |
| **Total Applications** | Total applications received across all jobs |
| **New Applications** | Applications received in last 7 days (with trend) |
| **Profile Views** | How many times job seekers viewed their listings |

Each stat card should show:
- Metric label
- Current value
- Change indicator (vs previous period)
- Relevant icon

### 2. Active Jobs Summary Section

Display employer's current job postings:
- Section title: "Your Active Jobs" or "Job Listings"
- Table or card list showing:
  - Job title
  - Status (Active, Paused, Expired, Draft)
  - Tier badge (Basic, Standard, Premium, Exclusive)
  - Applications count
  - Views count
  - Days remaining / Expiry date
  - Quick actions (View, Edit, Pause)
- Show 5 most recent/active jobs
- "View All Jobs" link
- "Post New Job" CTA button
- Use mock data for now

### 3. Recent Applications Section

Show latest applications received:
- Section title: "Recent Applications"
- List of 5-8 recent applications showing:
  - Applicant name (or placeholder)
  - Job title applied for
  - Application date/time
  - Status badge (New, Reviewed, Shortlisted, Rejected)
  - Quick action: View Application
- "View All Applications" link
- Use mock data

### 4. Subscription/Tier Status Section

Show current account tier and usage:
- Current subscription tier or "Pay-per-post" indicator
- Credits remaining (if applicable)
- CV database access status (based on tier)
- "Upgrade" or "Buy More" CTA if applicable
- Keep this compact - not the main focus

### 5. Quick Actions Section

Replace generic actions with employer-relevant ones:
- **Post a New Job** (primary CTA)
- **Browse CV Database** (if tier allows)
- **View Analytics**
- **Company Profile**

### 6. Performance Insights (Optional)

If space allows, add a simple insights section:
- Best performing job post
- Average time to first application
- Application conversion rate
- Keep it simple - can be expanded later

## Constraints

- **DO NOT** modify the header/navbar component
- **DO NOT** modify the sidebar component
- **DO NOT** modify layout files or routing
- **DO NOT** create actual API calls - use mock/placeholder data
- **ONLY** modify `apps/dashboard/src/app/(dashboard)/overview/page.tsx`
- Use **@borg/ui** components (GlassCard, GlassButton, etc.) - already imported
- Maintain the glassmorphism design aesthetic
- Keep existing import structure where possible
- Ensure responsive design

## Expected Output

- [ ] `apps/dashboard/src/app/(dashboard)/overview/page.tsx` - Complete rewrite with employer dashboard content

## Acceptance Criteria

- [ ] Stats section shows job posting metrics (Active Jobs, Applications, Views)
- [ ] Active jobs table/list displays mock job postings with status and tier
- [ ] Recent applications section shows mock application data
- [ ] Subscription/tier status is visible
- [ ] Quick actions are relevant to employers (Post Job, Browse CVs, etc.)
- [ ] All generic B2B content removed
- [ ] Glassmorphism design aesthetic maintained
- [ ] Responsive design works on all screen sizes
- [ ] No TypeScript errors
- [ ] Uses existing @borg/ui components

## Technical Notes

- Dashboard uses **Chakra UI** via **@borg/ui** package (not TailwindCSS)
- Glassmorphism components: `GlassCard`, `GlassButton`, `GlassPanel`, etc.
- Keep using `react-icons/fi` for icons (already imported)
- Extract mock data to constants at top of file for easy replacement
- Use TypeScript interfaces for data structures

## Mock Data Structures

```typescript
interface JobPost {
  id: string;
  title: string;
  status: 'active' | 'paused' | 'expired' | 'draft';
  tier: 'basic' | 'standard' | 'premium' | 'exclusive';
  applications: number;
  views: number;
  postedAt: string;
  expiresAt: string;
}

interface Application {
  id: string;
  applicantName: string;
  jobTitle: string;
  jobId: string;
  appliedAt: string;
  status: 'new' | 'reviewed' | 'shortlisted' | 'rejected';
}

interface EmployerStats {
  activeJobs: number;
  totalApplications: number;
  newApplications: number;
  newApplicationsChange: number; // percentage
  profileViews: number;
  profileViewsChange: number;
}

interface SubscriptionInfo {
  type: 'payPerPost' | 'subscription';
  tier?: 'basic' | 'standard' | 'premium';
  cvDatabaseAccess: boolean;
  creditsRemaining?: number;
}
```

## Icon Suggestions

Replace current icons with recruitment-relevant ones from `react-icons/fi`:
- `FiBriefcase` - Jobs/Postings
- `FiUsers` - Applications/Candidates
- `FiEye` - Views
- `FiFileText` - CV/Resume
- `FiTrendingUp` - Analytics
- `FiPlus` - Create/Add
- `FiEdit` - Edit
- `FiPause` - Pause
- `FiClock` - Time/Expiry
- `FiStar` - Featured/Premium

## Design Reference

```
┌─────────────────────────────────────────────────────────────────┐
│  Dashboard Overview                                              │
│  Welcome back! Here's your recruitment activity.                 │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │ 📋 5     │ │ 👥 47    │ │ 🆕 12    │ │ 👁 234   │           │
│  │ Active   │ │ Total    │ │ New Apps │ │ Profile  │           │
│  │ Jobs     │ │ Apps     │ │ +25%     │ │ Views    │           │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘           │
├─────────────────────────────────────────────────────────────────┤
│  Your Active Jobs                          [+ Post New Job]     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Senior Developer    │ Premium │ 12 apps │ 89 views │ ⋮ │   │
│  │ Marketing Manager   │ Standard│ 8 apps  │ 45 views │ ⋮ │   │
│  │ Sales Rep           │ Basic   │ 3 apps  │ 23 views │ ⋮ │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                           [View All Jobs →]     │
├──────────────────────────────┬──────────────────────────────────┤
│  Recent Applications         │  Quick Actions                   │
│  ┌────────────────────────┐ │  ┌────────────────────────────┐  │
│  │ John D. → Senior Dev   │ │  │ [Post a New Job]           │  │
│  │ 2 hours ago    [NEW]   │ │  │ [Browse CV Database]       │  │
│  │─────────────────────────│ │  │ [View Analytics]           │  │
│  │ Sarah M. → Marketing   │ │  │ [Company Profile]          │  │
│  │ 5 hours ago [REVIEWED] │ │  └────────────────────────────┘  │
│  └────────────────────────┘ │                                   │
│  [View All Applications →]  │  Your Plan: Standard              │
│                              │  CV Access: ✓ Enabled             │
└──────────────────────────────┴──────────────────────────────────┘
```

## Tier Badge Colors

Use consistent colors for tier badges:
- **Basic**: Gray (`neutral.500`)
- **Standard**: Blue (`blue.500`)
- **Premium**: Purple (`purple.500`)
- **Exclusive**: Gold/Amber (`orange.500` or `yellow.500`)

## Status Badge Colors

- **Active**: Green (`green.500`)
- **Paused**: Yellow (`yellow.500`)
- **Expired**: Red (`red.500`)
- **Draft**: Gray (`neutral.500`)
- **New** (application): Blue (`blue.500`)
- **Reviewed**: Purple (`purple.500`)
- **Shortlisted**: Green (`green.500`)
- **Rejected**: Red (`red.500`)

---

## Related

- References: [[initial/business-plan]]
- Related: Web homepage (17-homepage-rework) for job seeker side
