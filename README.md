# ⚡ Fastbreak

> A modern Sports Event Management application built with Next.js 15+, TypeScript, and Supabase.

**Fastbreak** helps you create, manage, and organize sports events all in one place. Features include event creation, editing, deletion, search, filtering, and authentication with both email/password and Google OAuth.

---

## 🚀 Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org) (App Router) with React 19
- **Language:** TypeScript
- **Database & Auth:** [Supabase](https://supabase.com)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com)
- **UI Components:** [Shadcn UI](https://ui.shadcn.com)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs)
- **Form Handling:** React Hook Form + Zod
- **Notifications:** [Sonner](https://sonner.emilkowal.ski)

---

## ✨ Features

- 🔐 **Authentication** - Email/password and Google OAuth flows with Supabase Auth
- 📅 **Event Management** - Create, view, edit, and delete events with multi-venue support
- 🔍 **Search & Filter** - Query by name/description and filter by sport, re-fetching from Supabase
- 🧭 **View Controls** - Toggle card/list dashboards with persisted user preference
- 🎨 **Responsive Design** - Optimized layouts across mobile, tablet, and desktop
- 🪄 **Feedback Loops** - Toast notifications, form validation, and skeleton loading states
- 💾 **Type-Safe** - Full TypeScript coverage with shared DTOs and helpers

---

## 📋 Spec Coverage

- ✅ Next.js 16+ App Router with TypeScript, Tailwind CSS 4, and shadcn/ui
- ✅ Supabase server actions for all database and auth access (no client-side Supabase calls)
- ✅ Supabase Auth supporting email/password + Google OAuth, with logout and session helpers
- ✅ Dashboard listing events with responsive card/list views, search, and sport filters
- ✅ Event CRUD flows covering multi-venue entry, validation, and optimistic UI refresh
- ✅ Toast-driven success/error feedback and shimmer loading states
- ✅ Consistent typing via shared `DbResult`, helper utilities, and Zod form schemas
- ✅ Route guard via `proxy.ts` keeps authenticated-only pages protected
- 🚀 Deployed in Vercel

---

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- A [Supabase](https://supabase.com) project

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd fastbreak
   ```

2. **Install dependencies**

   ```bash
   yarn install
   # or
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **Set up Supabase**
   - Create tables: `events` and `venues` (see Supabase Setup section below)
   - Enable Row Level Security (RLS) policies
   - Enable Google OAuth provider (optional)

5. **Start the development server**

   ```bash
   yarn dev
   # or
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
fastbreak/
├── app/
│   ├── _actions/          # Server actions (events, auth, venues)
│   ├── _components/       # Reusable components
│   ├── _helpers/          # Helper functions (DB, errors)
│   ├── _types/            # TypeScript type definitions
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard with events list
│   └── event/             # Event creation/editing pages
├── components/            # Shadcn UI components
├── proxy.ts               # Route protection proxy middleware
└── package.json
```

---

## 🎯 Key Scripts

```bash
yarn dev          # Start development server
yarn build        # Build for production
yarn start        # Start production server
yarn lint         # Run ESLint
yarn test         # Run tests
yarn test:watch   # Run tests in watch mode
```

---

## 🔑 Environment Variables

| Variable               | Description                                      | Required    |
| ---------------------- | ------------------------------------------------ | ----------- |
| `SUPABASE_URL`         | Your Supabase project URL                        | ✅ Yes      |
| `SUPABASE_ANON_KEY`    | Your Supabase anonymous key                      | ✅ Yes      |
| `NEXT_PUBLIC_SITE_URL` | Your site URL (for OAuth callbacks)              | ✅ Yes      |
| `ENV`                  | Set to `local` to bypass auth middleware locally | ❌ Optional |

---

## 🗄️ Supabase Setup

### Tables

**venues**

- `id` (int8, PK)
- `name` (varchar)
- Used for autocomplete and created on demand when new venue names are submitted.

**events**

- `id` (int8, PK)
- `fullName` / `shortName` (varchar)
- `description` (varchar, optional)
- `sportTypeId` (int2) — aligns with IDs in `constants/sports`
- `date` (timestamptz)
- `venueIds` (int2[]) — stores the IDs of selected venues

### RLS

- Allow authenticated users to `select`, `insert`, `update`, and `delete` their events (adjust role logic per your needs).
- Allow authenticated users to `select` and `insert` venues.

---

## 🏗️ Architecture Highlights

- **Server Actions** - All database interactions are server-side only
- **Object-Based Parameters** - All helper and action functions use object parameters for scalability
- **Centralized Error Handling** - Consistent error handling with `DbResult<T>` pattern
- **Modular Helpers** - Organized helper functions in dedicated folders
- **Type Safety** - Full TypeScript coverage with strict typing

---

## 🙏 Acknowledgments

Built with [Next.js](https://nextjs.org) and [Supabase](https://supabase.com).
