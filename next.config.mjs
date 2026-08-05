/**
 * Static-export config.
 *
 * The site ships as plain files (`out/`) with no Node server, so anything that
 * needs a running Next runtime — Image Optimizer, middleware, Server Actions,
 * rewrites — is off by construction.
 *
 * basePath: GitHub Pages serves a project site under /<repo>, so assets must be
 * prefixed. It is read from the environment rather than hardcoded so that
 * `npm run dev` and a custom-domain deploy both work with an empty value.
 * The CI workflow sets NEXT_PUBLIC_BASE_PATH=/company-intro.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Emit `about/index.html` rather than `about.html`, so a static host resolves
  // /about/ without per-host rewrite rules.
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
