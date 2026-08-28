/**
 * GitHub Pages serves static files, so the site is exported rather than run:
 * every page here is prerenderable (the 3D desk is a client island that boots
 * in the browser), which is why `output: "export"` costs us nothing.
 *
 * `basePath` is supplied by CI: empty for a user site (iamartyaa.github.io),
 * "/<repo>" for a project site. Nothing in the app hardcodes a path.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  transpilePackages: ["three"],
};

export default nextConfig;
