sequenceDiagram
    actor User
    participant Frontend as Next.js UI (Client)
    participant Backend as Next.js Server Actions
    participant Database as Supabase

    %% --- Sign-Up Flow ---
    User->>Frontend: Fills out Sign-Up Form
    Frontend->>Backend: Calls `signUpWithEmail(formData)`
    Backend->>Database: Supabase Auth creates user in `auth.users`
    Database-->>Backend: Returns user session
    Note over Database: Trigger automatically creates a new row in `profiles` table.
    Backend-->>Frontend: Redirects to /dashboard

    %% --- Create Plan Flow ---
    User->>Frontend: Clicks "Create New Plan"
    Frontend->>Backend: Renders Plan Creation Form (`/dashboard/plans/new`)
    User->>Frontend: Fills in plan details (title, dates, tasks)
    Frontend->>Backend: Submits form, calls `createPlan(formData)`
    Backend->>Database: INSERT into `plans` (status='draft')
    Backend->>Database: INSERT into `plan_items` for each task/contact
    Database-->>Backend: Confirms insertion
    Backend-->>Frontend: Redirects to the new plan page (`/dashboard/plans/[planId]`)

    %% --- Publish & Share Flow ---
    User->>Frontend: On a plan page, clicks "Publish"
    Frontend->>Backend: Calls `publishPlan(planId)` action
    Backend->>Backend: Generates a unique `public_link_id` (e.g., using nanoid)
    Backend->>Database: UPDATE `plans` SET status='published', public_link_id='...' WHERE id=planId
    Database-->>Backend: Confirms update
    Backend-->>Frontend: Returns success, page re-renders
    Frontend->>User: Displays the shareable link: "handoverplan.com/shr_a1b2c3d4"

    %% --- Public View Flow ---
    actor Visitor
    Visitor->>Frontend: Accesses the public URL
    Frontend->>Backend: Renders public page `/[publicLinkId]`
    Backend->>Database: SELECT * FROM `plans` WHERE public_link_id='...'
    Note over Database: RLS policy allows this public read.
    Backend->>Database: SELECT * FROM `plan_items` WHERE plan_id='...'
    Database-->>Backend: Returns plan data
    Backend-->>Frontend: Renders the read-only plan view
    Frontend->>Visitor: Displays the handover plan