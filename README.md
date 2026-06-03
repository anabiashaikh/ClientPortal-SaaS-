# ClientPortal SaaS

A full-featured client portal built with Next.js, Prisma, and Supabase.

## 🚀 Live Demo

**Production URL:** [https://client-portal-saa-s.vercel.app](https://client-portal-saa-s.vercel.app)

## Getting Started (Local Development)

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tech Stack

- **Frontend/Backend:** Next.js 15 (App Router)
- **Database:** PostgreSQL via Supabase
- **ORM:** Prisma
- **Auth:** NextAuth.js
- **Storage:** Supabase Storage
- **Deployment:** Vercel

## Environment Variables

Create a `.env` file with the following variables:

```env
DATABASE_URL=your_supabase_pooler_url
DIRECT_URL=your_supabase_direct_url
AUTH_SECRET=your_auth_secret
AUTH_URL=https://client-portal-saa-s.vercel.app
AUTH_GOOGLE_ID=your_google_client_id
AUTH_GOOGLE_SECRET=your_google_client_secret
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Deploy on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/anabiashaikh/ClientPortal-SaaS-)

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
