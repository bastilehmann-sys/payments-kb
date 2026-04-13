import { auth } from "@/auth"

export default auth((req) => {
  const isAuth = !!req.auth
  const { pathname } = req.nextUrl
  const publicPaths = ["/login", "/api/auth"]
  const isPublic = publicPaths.some((p) => pathname.startsWith(p))
  if (!isAuth && !isPublic) {
    return Response.redirect(new URL("/login", req.nextUrl))
  }
})

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
