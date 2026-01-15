---
title: Rework Homepage for Job Advertisement Platform
id: 17-homepage-rework
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
  - homepage
  - web
  - landing-page
  - job-board
  - b2c
dependencies: []
blocks: []
related_specs:
  - "[[initial/business-plan]]"
related_planning: []
notes: Current homepage is a technical placeholder. Needs to reflect the job advertisement platform value proposition.
---

# Rework Homepage for Job Advertisement Platform

## Context

The current homepage (`apps/web/src/app/page.tsx`) is a technical boilerplate showing the Turborepo stack info (Next.js, NestJS, shared types example). This was created during initial setup without insight into the actual business requirements.

The platform is a **dual-sided job advertisement marketplace** connecting employers (B2B) with job seekers (B2C). The web app (`apps/web`) is the **public job board and job seeker portal** (B2C side).

## Goal

Transform the homepage into a proper job advertisement platform landing page that:
1. Clearly communicates the platform's value proposition to job seekers
2. Provides prominent job search functionality
3. Showcases featured/recent job listings
4. Includes secondary CTA for employers

## Current State

**File**: `apps/web/src/app/page.tsx`

Current implementation shows:
- "MP Clone" title
- Technical stack information
- Example User JSON from @borg/types
- Grid showing Frontend/Backend tech

This does not reflect the job board platform purpose at all.

## Requirements

### 1. Hero Section

Create an impactful hero section with:
- **Headline**: Clear value proposition for job seekers (e.g., "Find Your Next Career Opportunity")
- **Subheadline**: Brief description of the platform
- **Search Bar**: Prominent job search input with:
  - Keyword/job title input field
  - Location input field (optional)
  - Search button
- **Quick Links**: Popular categories or job types (e.g., "IT", "Marketing", "Sales", "Remote")

### 2. Featured Jobs Section

Display highlighted job listings:
- Section title: "Featured Jobs" or "Hot Opportunities"
- Grid or list of 4-6 job cards showing:
  - Job title
  - Company name
  - Location
  - Employment type (Full-time, Part-time, etc.)
  - Posted date or "New" badge
  - Brief description excerpt
- "View All Jobs" link/button
- Use placeholder/mock data for now (will be replaced with API data later)

### 3. Job Categories Section

Browse by category/industry:
- Section title: "Browse by Category"
- Grid of category cards with:
  - Category icon (use emoji or simple icons)
  - Category name
  - Job count placeholder (e.g., "150+ jobs")
- Categories to include based on common job sectors:
  - Technology / IT
  - Marketing & Sales
  - Finance & Accounting
  - Healthcare
  - Education
  - Engineering
  - Customer Service
  - Human Resources

### 4. Value Proposition Section

Why job seekers should use this platform:
- Section title: "Why Choose Us"
- 3-4 benefit cards highlighting:
  - Free access to all job listings
  - Easy application process
  - Profile visibility to employers
  - Job alerts and notifications
- Keep copy concise and benefit-focused

### 5. Employer CTA Section

Secondary call-to-action for employers:
- Brief headline: "Looking to Hire?"
- Short paragraph about posting jobs
- CTA button: "Post a Job" (link to dashboard or employer signup)
- Keep this section smaller/less prominent than job seeker content

### 6. Footer Integration

Ensure the homepage content works with the existing layout. The homepage should only contain the main content area - header and footer are handled separately.

## Constraints

- **DO NOT** modify the header component or any navigation elements
- **DO NOT** modify the layout.tsx or other shared components
- **DO NOT** create actual API calls - use mock/placeholder data
- **DO NOT** add new dependencies unless absolutely necessary
- **ONLY** modify `apps/web/src/app/page.tsx`
- Use **TailwindCSS** for styling (already configured in web app)
- Keep the design clean and professional
- Ensure responsive design (mobile-first approach)
- Remove all traces of the current boilerplate/technical content

## Expected Output

- [ ] `apps/web/src/app/page.tsx` - Complete rewrite with new homepage sections

## Acceptance Criteria

- [ ] Hero section with search bar is prominently displayed
- [ ] Featured jobs section shows 4-6 mock job listings
- [ ] Category browsing section with 6-8 categories
- [ ] Value proposition section for job seekers
- [ ] Employer CTA section present but secondary
- [ ] All boilerplate/technical content removed
- [ ] Responsive design works on mobile, tablet, and desktop
- [ ] No TypeScript errors
- [ ] Visual design is clean and professional

## Technical Notes

- The web app uses **Next.js 15** with **React 19**
- Styling is **TailwindCSS** (not Chakra UI - that's for dashboard)
- Use semantic HTML elements for accessibility
- Consider extracting mock data to constants at the top of the file for easy replacement later
- Use TypeScript interfaces for job and category data structures

## Mock Data Structure

```typescript
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
  icon: string; // emoji
  jobCount: number;
  slug: string;
}
```

## Design Reference

The homepage should follow common job board patterns:
- Clean, uncluttered layout
- High contrast for important CTAs
- Card-based design for job listings and categories
- Adequate whitespace between sections
- Professional color scheme (can use existing Tailwind colors)

## Example Section Structure

```
┌─────────────────────────────────────────────────────────┐
│                     HERO SECTION                        │
│  ┌─────────────────────────────────────────────────┐   │
│  │    Find Your Next Career Opportunity            │   │
│  │    [Search: Job title...] [Location...] [🔍]    │   │
│  │    Popular: IT | Marketing | Sales | Remote     │   │
│  └─────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────┤
│                  FEATURED JOBS                          │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐       │
│  │Job 1│ │Job 2│ │Job 3│ │Job 4│ │Job 5│ │Job 6│       │
│  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘       │
│                    [View All Jobs]                      │
├─────────────────────────────────────────────────────────┤
│                  BROWSE BY CATEGORY                     │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐           │
│  │   💻   │ │   📊   │ │   💰   │ │   🏥   │           │
│  │  Tech  │ │Marketing│ │Finance │ │Health  │           │
│  │ 150+   │ │  80+   │ │  60+   │ │ 120+   │           │
│  └────────┘ └────────┘ └────────┘ └────────┘           │
├─────────────────────────────────────────────────────────┤
│                  WHY CHOOSE US                          │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │
│  │Free     │ │Easy     │ │Profile  │ │Job      │       │
│  │Access   │ │Apply    │ │Visibility│ │Alerts  │       │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘       │
├─────────────────────────────────────────────────────────┤
│                  EMPLOYER CTA                           │
│  Looking to Hire? [Post a Job →]                        │
└─────────────────────────────────────────────────────────┘
```

---

## Related

- References: [[initial/business-plan]]
- Related: Header/navigation handled separately (see 15-header-auth-state)
