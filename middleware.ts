import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Paths that don't require authentication
const publicPaths = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/api/auth/login",
  "/api/auth/signup",
  "/api/auth/forgot-password",
  "/api/auth/reset-password",
];

// Function to verify JWT token
async function verifyToken(token: string) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  try {
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );
    return verified.payload;
  } catch (error) {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path is public
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // Get token from cookies
  const token = request.cookies.get("token")?.value;

  // Create URL objects for redirects
  const loginUrl = new URL("/login", request.url);
  const homeUrl = new URL("/", request.url);

  // Add the original URL as a redirect parameter
  loginUrl.searchParams.set("redirect", pathname);

  // If the path is public and user is authenticated, redirect to home
  if (isPublicPath && token) {
    try {
      const verified = await verifyToken(token);
      if (verified) {
        return NextResponse.redirect(homeUrl);
      }
    } catch (error) {
      // Token verification failed, continue with public path
    }
  }

  // If the path is protected and user is not authenticated, redirect to login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(loginUrl);
  }

  // If the path is protected and token exists, verify it
  if (!isPublicPath && token) {
    try {
      const verified = await verifyToken(token);
      if (!verified) {
        return NextResponse.redirect(loginUrl);
      }
    } catch (error) {
      return NextResponse.redirect(loginUrl);
    }
  }

  // Add security headers to all responses
  const response = NextResponse.next();

  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains"
  );
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
  );

  return response;
}

// Configure which routes should be handled by middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
