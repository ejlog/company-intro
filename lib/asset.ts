/**
 * Prefix a `public/` path with the deploy basePath.
 *
 * Next rewrites basePath into `next/link` hrefs and `next/image` sources, but
 * NOT into a plain `<img src>` or a CSS `url()`. The site keeps plain `<img>`
 * so the existing `.ph-img` rules apply unchanged, so those paths go through
 * here instead.
 *
 * Reads the same env var as next.config.mjs. It must be NEXT_PUBLIC_* to be
 * inlined into the client bundle at build time.
 */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export function asset(path: string): string {
  return `${BASE_PATH}${path.startsWith('/') ? path : `/${path}`}`;
}
