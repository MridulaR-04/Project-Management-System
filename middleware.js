import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/onboarding(.*)",
  "/organisation(.*)",
  "/project(.*)",
  "/issue(.*)",
]);

export default clerkMiddleware((auth, request) => {
  if (!auth().userId && isProtectedRoute(request)) {
    return auth().redirectToSignIn();
  }
  if (
    auth().userId &&
    !auth().orgId &&
    request.nextUrl.pathname !== "/onboarding" &&
    request.nextUrl.pathname !== "/"
  ) {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
