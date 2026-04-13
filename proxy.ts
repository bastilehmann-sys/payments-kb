import { auth } from "@/auth"

export default auth((req) => {
  const isAuth = !!req.auth
  const { pathname } = req.nextUrl
  const publicPaths = ["/login", "/api/auth"]
  const isPublic = publicPaths.some((p) => pathname.startsWith(p))

  if (!isAuth && !isPublic) {
    return Response.redirect(new URL("/login", req.nextUrl))
  }

  // After auth check succeeds, check if path needs API keys
  if (isAuth) {
    const keysRequiredPaths = ["/chat", "/admin"]
    const needsKeys = keysRequiredPaths.some((p) => pathname.startsWith(p))
    if (needsKeys) {
      const hasAnth = req.cookies.get("ak_anth")
      const hasOai = req.cookies.get("ak_oai")
      if (!hasAnth || !hasOai) {
        return Response.redirect(new URL("/settings?reason=missing-keys", req.nextUrl))
      }
    }
  }
})

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
