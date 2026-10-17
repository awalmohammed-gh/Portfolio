/*
 * Shared by the proxy and server code. In production the __Host- prefix makes
 * browsers enforce Secure, Path=/ and no Domain attribute on the cookie.
 */
export const SESSION_COOKIE =
  process.env.NODE_ENV === "production" ? "__Host-portfolio_admin" : "portfolio_admin";

export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days, absolute
