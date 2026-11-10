const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Prefix a path under public/ with the deploy base path.
 * Next adds basePath to next/link and next/image only, so plain <img src>
 * and inline url() values must go through this helper.
 */
export function asset(path: string): string {
  return `${basePath}${path.startsWith("/") ? path : `/${path}`}`;
}
