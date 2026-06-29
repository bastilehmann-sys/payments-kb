import { auth } from "@/auth"

export default auth((req) => {
  const isAuth = !!req.auth
  const { pathname } = req.nextUrl
  const publicPaths = ["/login", "/api/auth"]
  const isPublic = publicPaths.some((p) => pathname.startsWith(p))

  // Allow agent API calls with valid Bearer token
  const agentKey = process.env.AGENT_API_KEY
  const authHeader = req.headers.get("Authorization")
  const hasValidApiKey =
    agentKey &&
    authHeader?.startsWith("Bearer ") &&
    authHeader.slice(7) === agentKey

  if (!isAuth && !isPublic && !hasValidApiKey) {
    return Response.redirect(new URL("/login", req.nextUrl))
  }
})

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
