import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
  matcher: [
    '/((?!_|/api/webhook/clerk|/\\.?\\w+$).*)',
    '/(api|trpc)(.*)',
  ],
};
