import createMiddleware from 'next-intl/middleware';
import { auth } from '@/lib/auth'
import {routing} from '@/i18n/routing';
import { NextResponse } from 'next/server'

const intlMiddleware = createMiddleware(routing);

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
  const isLoginPage = req.nextUrl.pathname === '/admin/login'

  if (isAdminRoute && !isLoggedIn && !isLoginPage) {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }

  if (isLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL('/admin', req.url))
  }

  if (!isAdminRoute) {
    return intlMiddleware(req)
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}