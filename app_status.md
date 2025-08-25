### **HandoverPlan MVP: Technical Description & Project Plan**

#### **Technical MVP Specification**

The goal of the MVP is to build a full-stack, single-tenant web application using Next.js (App Router) and Supabase. The application will enable an authenticated user to perform the full lifecycle of creating, managing, and publicly sharing a structured "handover plan."

**Core Architecture:**
*   **Frontend:** Next.js with React Server Components (RSC) for data fetching and static rendering, and Client Components for interactivity (e.g., forms). UI will be built with shadcn/ui and styled with Tailwind CSS.
*   **Backend:** Next.js Route Handlers and Server Actions will serve as the API layer, communicating directly with the Supabase backend. All business logic will be encapsulated within these server-side functions.
*   **Database:** A PostgreSQL database managed by Supabase. Data integrity and security will be enforced primarily through Row Level Security (RLS) policies.
*   **Authentication:** Supabase Auth will manage user identity, supporting both JWT-based sessions for standard Email/Password sign-up/sign-in and an OAuth flow for Google. A `middleware.ts` file will protect application routes based on authentication state.

**Feature Set & Data Model:**
1.  **User & Profile Management:**
    *   Authentication will be handled by `auth.users`.
    *   A `profiles` table, linked one-to-one with `auth.users`, will store application-specific user metadata (`full_name`, `avatar_url`).
    *   A database trigger (`on_auth_user_created`) will automatically populate the `profiles` table upon user creation, handling both OAuth and email sign-ups.
2.  **Handover Plan Core (`plans` table):**
    *   A user can create a plan, which is a parent document containing metadata like `title`, `author_id`, `start_date`, and `end_date`.
    *   A plan will have a `status` field, initially `'draft'`, which can be transitioned to `'published'`.
3.  **Dynamic Plan Content (`plan_items` table):**
    *   A plan consists of multiple `plan_items`. This table uses a flexible, single-table design with a `type` column (`'task'`, `'contact'`) and a `content` column of type `JSONB` to store varying data structures for each item type.
    *   This allows for extensibility without schema migrations for new item types in the future.
4.  **Public Sharing Mechanism:**
    *   Upon publishing a plan, a unique, non-sequential `public_link_id` will be generated and stored in the `plans` table.
    *   A public-facing dynamic route (`/[publicLinkId]`) will render a read-only view of the plan. Access control for this route will be managed by Supabase RLS policies that allow `SELECT` operations on published plans and their items.

---

### **Implementation To-Do List**

#### **Phase 1: Project Setup & Foundation**

*   **1.1. Initialize Next.js Project**
    *   ✅ (Completed) Scaffold the project using `create-next-app`.
    *   ✅ (Completed) Clean up boilerplate and set up the basic project structure.

*   **1.2. Install & Configure Dependencies**
    *   ✅ (Completed) Install Supabase, shadcn/ui, and other necessary libraries.
    *   ✅ (Completed) Configure Tailwind CSS, shadcn/ui component aliasing, and environment variables (`.env.local`).

*   **1.3. Set Up Supabase Database & Auth**
    *   **a. Go to the Supabase SQL Editor in your project dashboard.**
    *   **b. Run the Master SQL Script below.** This single script will set up all your tables, security policies, and automation.

```sql
-- =================================================================
-- MASTER SQL SCRIPT FOR ALLSET MVP
-- Run this entire script in the Supabase SQL Editor.
-- =================================================================

-- Part 1: Automation for Profile Creation
-- Creates a function and trigger to automatically create a user profile
-- upon new user sign-up, working for both email and OAuth.
-- -----------------------------------------------------------------

/**
 * Creates a new profile entry for a new user.
 */
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER -- Important for permissions
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$;

-- Drop trigger if it exists to ensure a clean setup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

/**
 * Creates a trigger that calls the function upon user creation.
 */
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();


-- Part 2: Profiles Table
-- Stores public user information, linked one-to-one with auth.users.
-- -----------------------------------------------------------------

-- Create the table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile." ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile." ON profiles FOR UPDATE USING (auth.uid() = id);


-- Part 3: Plans Table
-- The core table for handover documents.
-- -----------------------------------------------------------------

-- Create the table
CREATE TABLE plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  public_link_id TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;

-- RLS Policies for plans
CREATE POLICY "Users can manage their own plans." ON plans FOR ALL USING (auth.uid() = author_id);
CREATE POLICY "Public can view published plans." ON plans FOR SELECT USING (status = 'published' AND public_link_id IS NOT NULL);


-- Part 4: Plan Items Table
-- Stores individual line items (tasks, contacts) for each plan.
-- -----------------------------------------------------------------

-- Create the table
CREATE TABLE plan_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  content JSONB,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE plan_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for plan_items
CREATE POLICY "Users can manage items in their own plans." ON plan_items FOR ALL
  USING (
    auth.uid() = (SELECT author_id FROM plans WHERE id = plan_id)
  );

CREATE POLICY "Public can view items in published plans." ON plan_items FOR SELECT
  USING (
    (SELECT status FROM plans WHERE id = plan_id) = 'published'
  );

-- =================================================================
-- END OF SCRIPT
-- =================================================================
```

*   **1.4. Establish Core App Layout**
    *   ✅ (Completed) Configure the root `layout.tsx` with fonts and base styles.
    *   ✅ (Completed) Create a boilerplate landing page (`/`) and a boilerplate dashboard layout.

---

#### **Phase 2: Authentication Flow**

*   **2.1. Implement Login Functionality**
    *   ✅ (Completed) Create the Login page UI (`/login`) with forms for email and a button for Google OAuth.
    *   ✅ (Completed) Implement the `signInWithEmail` Server Action.
    *   ✅ (Completed) Implement the `signInWithOAuth('google')` Server Action.
    *   ✅ (Completed) Configure the Google OAuth provider in the Supabase Dashboard.
    *   ✅ (Completed) Implement the `signOut` Server Action.

*   **2.2. Secure Application Routes**
    *   ✅ (Completed) Create and configure `middleware.ts` to protect the `/dashboard` route group and handle redirects for authenticated/unauthenticated users.

*   **2.3. Build Remaining Authentication Features (To-Do)**
    *   **a. Email Sign-Up:**
        *   Create the Sign-Up page UI at `app/(auth)/signup/page.tsx`.
        *   The form should include inputs for "Email", "Password", and "Confirm Password".
        *   Implement the `signUpWithEmail(formData)` Server Action in `app/(auth)/actions.ts`.
    *   **b. Password Recovery:**
        *   Create the Forgot Password page UI at `app/(auth)/forgot-password/page.tsx`.
        *   The form should have a single "Email" input and a "Send Reset Link" button.
        *   Implement the `sendPasswordResetEmail(formData)` Server Action.
        *   *Note: You may also need a page for the user to enter their new password after clicking the link.*

---

#### **Phase 3: Core Feature - Plan Creation**

*   **3.1. Build the Plan Creation Form Component**
    *   ✅ (Completed) Create a reusable component: `components/plans/plan-form.tsx`. Mark it as a client component (`'use client'`).
    *   ✅ (Completed) **Static Fields:** Add `Input` for "Plan Title" and `DatePicker` for "Absence Start/End Dates".
    *   ✅ (Completed) **Dynamic "Tasks/Projects" Section:**
        *   Use `useState` to manage an array of task objects.
        *   Create UI elements to add, remove, and edit tasks within the form. Each task should have fields for Title, Status, Link, and Priority.
    *   ✅ (Completed) **Dynamic "Important Contacts" Section:**
        *   Implement the same dynamic array pattern for contacts, with fields for Name, Role, and Contact Info.
    *   ✅ (Completed) **Action Buttons:** Add "Save as Draft" and "Publish" buttons to the form.

*   **3.2. Implement Backend Logic for Plan Creation**
    *   ✅ (Completed) Create a new file for plan-related actions: `app/(main)/plans/actions.ts`.
    *   ✅ (Completed) Implement a `createPlan(formData)` Server Action that parses form data, inserts a new record into the `plans` table, and inserts the associated items into the `plan_items` table.
    *   ✅ (Completed) Use `revalidatePath` and `redirect` to navigate the user to the new plan's view page upon successful creation.

*   **3.3. Create the "New Plan" Page**
    *   ✅ (Completed) Create the page file at `app/(main)/dashboard/plans/new/page.tsx`.
    *   This page's primary purpose is to render the `<PlanForm />` component.

---

#### **Phase 4: Plan Viewing & Management**

*   **4.1. Enhance the Main Dashboard**
    *   ✅ (Completed) Modify the main dashboard page at `app/(main)/dashboard/page.tsx`.
    *   ✅ (Completed) Fetch and display a list of all plans created by the currently logged-in user.
    *   ✅ (Completed) Make each plan in the list a link to its dedicated view page (`/dashboard/plans/[planId]`).
    *   ✅ (Completed) Ensure the "Create New Plan" button is prominent and links to `/dashboard/plans/new`.

*   **4.2. Build the Plan View Page**
    *   ✅ (Completed) Create the dynamic route `app/(main)/dashboard/plans/[planId]/page.tsx`.
    *   ✅ (Completed) Fetch the specific plan and all its `plan_items` from Supabase.
    *   ✅ (Completed) Render all plan details in a clean, read-only format.
    *   ✅ (Completed) Implement conditional UI: If the plan is a draft, show "Edit" and "Publish" buttons.

*   **4.3. Implement Plan Editing**
    *   ✅ (Completed) Create the edit page: `app/(main)/dashboard/plans/[planId]/edit/page.tsx`.
    *   ✅ (Completed) This page should fetch the existing plan data and pass it as props to the reusable `<PlanForm />` to pre-populate the fields.
    *   ✅ (Completed) Create an `updatePlan(planId, formData)` Server Action to handle the database update logic.

---

#### **Phase 5: The "Killer" Feature - Public Sharing**

*   **5.1. Implement the Publish Logic**
    *   ✅ (Completed) Create a `publishPlan(planId)` Server Action.
    *   ✅ (Completed) This action will generate a unique `public_link_id`, update the plan's `status` to 'published', and save the changes to the database.
    *   ✅ (Completed) Connect this action to the "Publish Plan" button on the plan view page.

*   **5.2. Enhance the Plan View Page UI for Sharing**
    *   ✅ (Completed) If a plan's status is 'published', hide the "Edit" and "Publish" buttons.
    *   ✅ (Completed) Instead, display a "Share" section showing the full public URL with a convenient "Copy Link" button.

*   **5.3. Build the Public-Facing Page**
    *   ✅ (Completed) Create the dynamic route at the root level: `app/[publicLinkId]/page.tsx`.
    *   ✅ (Completed) This Server Component will fetch the plan data using the `publicLinkId` from the URL.
    *   ✅ (Completed) It will render the plan details in a minimal, public-facing layout (no dashboard navigation or user menus).
    *   ✅ (Completed) If no plan is found for the given link, it should display a "Not Found" page.

---

#### **Phase 6: Final Polish & Deployment**

*   **6.1. End-to-End Testing**
    *   ✅ (Completed) Thoroughly test every user flow.
    *   ✅ (Completed) Verify that all RLS policies are working as expected.

*   **6.2. Styling and Responsiveness**
    *   ✅ (Completed) Review all pages and components to ensure they are responsive.
    *   ✅ (Completed) Add loading states and user feedback for form submissions.

*   **6.3. Deployment**
    *   ✅ (Completed) Deploy to Vercel and conduct final testing on the production URL.

---

---

#### **Phase 7: Enhance Public-Facing Landing Page**

*   **7.1. Build Out Landing Page Content**
    *   Create a "Features" section component (`components/landing/features.tsx`) that highlights key benefits (e.g., "Easy Plan Creation", "Public Sharing", "Structured Content").
    *   Create an "FAQ" section component (`components/landing/faq.tsx`) using an `Accordion` to answer common questions.
    *   Create a "Call to Action" (CTA) section near the footer to encourage sign-ups.
    *   Integrate these new components into `app/page.tsx` to create a more comprehensive marketing page.

*   **7.2. Refine Branding and Copy**
    *   Update the `Hero` component with more compelling marketing copy for the heading and description.
    *   Replace placeholder images and text throughout the landing page with final assets.

---

#### **Phase 8: Implement User Feedback System**

*   **8.1. Create Feedback Table in Supabase**
    *   Run the following SQL in the Supabase Editor to create a table for collecting feedback.

    ```sql
    -- Create the feedback table
    CREATE TABLE feedback (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      type TEXT, -- e.g., 'bug', 'suggestion', 'other'
      created_at TIMESTAMPTZ DEFAULT now()
    );

    -- Enable RLS
    ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

    -- RLS Policies for feedback
    CREATE POLICY "Users can submit feedback." ON feedback FOR INSERT WITH CHECK (auth.uid() = user_id);
    CREATE POLICY "Users can view their own feedback." ON feedback FOR SELECT USING (auth.uid() = user_id);
    -- Optional: Create a policy for admins to view all feedback.
    ```

*   **8.2. Build Feedback Form Component**
    *   Create a new component `components/feedback/feedback-dialog.tsx`.
    *   Use a `Dialog` or `Sheet` from shadcn/ui to house a simple form with a `Textarea` for the feedback content and maybe a `Select` for the feedback type.
    *   Add a "Feedback" or "Help" button to the `AppSidebar` or `NavUser` dropdown that triggers this dialog.

*   **8.3. Create Feedback Submission Action**
    *   Create a new file `app/(main)/feedback/actions.ts`.
    *   Implement a `submitFeedback(formData)` Server Action that takes the form data and inserts it into the new `feedback` table.
    *   Provide user feedback upon successful submission (e.g., a toast notification).

---

#### **Phase 9: Introduce App Personalization**

*   **9.1. Build User Profile Management Page**
    *   Create a new page at `app/(main)/dashboard/account/page.tsx`.
    *   Build a form on this page that allows users to update their `full_name` from the `profiles` table.
    *   Create an `updateProfile(formData)` Server Action to handle the update logic.
    *   *Advanced: Add functionality for users to upload a new avatar using Supabase Storage.*

*   **9.2. Implement Theme Switching (Dark/Light Mode)**
    *   Install the `next-themes` package: `npm install next-themes`.
    *   Create a `components/theme-provider.tsx` and wrap your root layout in it, as per the `next-themes` documentation.
    *   Create a `components/theme-toggle.tsx` component that renders a button to switch between light, dark, and system themes.
    *   Add the `ThemeToggle` component to the `NavUser` dropdown menu for easy access.

---

#### **Phase 10: SEO and Go-to-Market Polish**

*   **10.1. Implement Dynamic Metadata for Public Pages**
    *   In `app/[publicLinkId]/page.tsx`, export an async function `generateMetadata({ params })`.
    *   Inside this function, fetch the plan corresponding to `params.publicLinkId`.
    *   Return a `Metadata` object with a dynamic `title` (e.g., `HandoverPlan | ${plan.title}`) and `description`. This is crucial for search engine indexing and social sharing previews.

*   **10.2. Optimize Core App Metadata**
    *   Update the static metadata in `app/layout.tsx` with a final, production-ready title and description for the entire application.
    *   Ensure the landing page (`app/page.tsx`) has compelling H1 tags and content.

*   **10.3. Create `sitemap.xml` and `robots.txt`**
    *   Create a `public/robots.txt` file to instruct search engine crawlers on which pages to index.
    *   Create a `app/sitemap.ts` file (as a Route Handler) to dynamically generate a sitemap that includes the landing page and all *publicly published* plan URLs.

---

#### **Phase 11: Final Review & Re-Deployment**

*   **11.1. End-to-End Testing**
    *   Thoroughly test all new features: landing page links, feedback submission, profile updates, and theme switching.
    *   Verify that dynamic metadata on public pages is generating correctly.

*   **11.2. Final UX/UI Review**
    *   Review all new pages and components for responsiveness and visual consistency.
    *   Ensure loading states and user feedback (e.g., toasts) are implemented for all new server actions.

*   **11.3. Re-Deploy**
    *   Deploy the final, enhanced version of the application to Vercel.
    *   Conduct a final round of testing on the live production URL.