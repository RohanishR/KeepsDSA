import { auth } from "@/auth";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith('/api/auth');
  
  // Define public routes
  const publicRoutes = ['/', '/login', '/register', '/forgot-password', '/reset-password', '/explore'];
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return;
  }

  // Redirect unauthenticated users to login if they try to access a protected route
  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);
    return Response.redirect(new URL(`/login?callbackUrl=${encodedCallbackUrl}`, nextUrl));
  }

  // Redirect authenticated users away from auth pages
  const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];
  if (isLoggedIn && authRoutes.includes(nextUrl.pathname)) {
    return Response.redirect(new URL('/dashboard', nextUrl));
  }

  return;
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
