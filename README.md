This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# local
NEXT_PUBLIC_API_URL=https://api.example.com

# env 
NEXT_PUBLIC_API_URL=https://localhost:3000
# --- API CONFIGURATION ---
# Replace with your actual backend URL for production
# --- FEATURE TOGGLES (Optional) ---
# Useful for enabling/disabling features across different environments
NEXT_PUBLIC_ENABLE_REGISTRATION=true
NEXT_PUBLIC_MAINTENANCE_MODE=false

# --- AUTHENTICATION (Example) ---
# If using a third-party auth provider like Auth0 or NextAuth
# NEXTAUTH_SECRET=your_super_secret_key_here
# NEXTAUTH_URL=http://localhost:3000


# .env.local
NEXT_PUBLIC_AUTH_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJMb2dpbk5hbWUiOiJDSUYiLCJuYmYiOjE3NTM3NzU3ODIsImV4cCI6MTc4NTMxMTc4MiwiaWF0IjoxNzUzNzc1NzgyLCJpc3MiOiJodHRwczovL2xvY2FsaG9zdDo3MTI1LyIsImF1ZCI6Imh0dHBzOi8vbG9jYWxob3N0OjcxMjUvIn0.9Oc0vzoLFrYmMpzfN5z9cDy-ysE3PgyxY8o4XC8ZRuI
NEXT_PUBLIC_AUTH_API=https://projectsapi.lpu.in/
NEXT_PUBLIC_AUTH_API_LOCAL=https://localhost:7125/
NEXT_PUBLIC_FOLDER_URL=http://172.129.2.216/web/webftp/MOUDocuments/

LOGIC_SERVER_URL=https://loadlogic.azurewebsites.net/