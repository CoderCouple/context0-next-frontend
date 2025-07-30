import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/", // ✅ Make home page public
  "/docs", // ✅ Make docs page public
  "/pricing", // ✅ Make pricing page public
  "/contact", // ✅ Make contact page public
  "/blog", // ✅ Make blog listing page public
  "/blog/(.*)", // ✅ Make all blog posts public
  "/(.*)?sign-in(.*)",
  "/(.*)?sign-up(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth();
  
  // Redirect authenticated users away from landing page to dashboard
  if (userId && request.nextUrl.pathname === "/") {
    return Response.redirect(new URL("/dashboard", request.url));
  }
  
  if (!isPublicRoute(request)) {
    await auth.protect();
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
