import arcjet, { detectBot, shield } from '@arcjet/next';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { error } from 'console';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher([
  "/appointments(.*)",
  "/explore(.*)",
  "/onboarding(.*)",
  "/dashboard(.*)",
])

const isWebhookRoute = createRouteMatcher([
  "/api/webhooks/stream(.*)"
])

const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    shield({
      mode: "LIVE"
    }),
    detectBot({
      mode: "LIVE",
      allow: [
        "CATEGORY:SEARCH_ENGINE",
        "CATEGORY:PREVIEW"
      ]
    })
  ]
})

export default clerkMiddleware(async (auth, req) => {

  if(!isWebhookRoute(req)) {
    const decesion = await aj.protect(req)

    if(decesion.isDenied()) return NextResponse.json({error: "Forbidden"}, {status: 403})
  } 

  const {userId} = await auth()

  if(!userId && isProtectedRoute(req)) {
    const {redirectToSignIn} = await auth()
    return redirectToSignIn()
  }

  return NextResponse.next()
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};