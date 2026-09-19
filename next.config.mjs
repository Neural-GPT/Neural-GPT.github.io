/**
 * GitHub Pages deployment
 * ------------------------------------------------------------------
 * If your repo is  <username>.github.io   -> leave BASE_PATH as ''
 * If your repo is  <username>/portfolio   -> set BASE_PATH = '/portfolio'
 * The GitHub Action in .github/workflows/deploy.yml can also inject this
 * via the NEXT_PUBLIC_BASE_PATH environment variable.
 */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',              // static HTML/CSS/JS -> ./out
  basePath: BASE_PATH,
  assetPrefix: BASE_PATH || undefined,
  images: { unoptimized: true }, // no Image Optimization server on Pages
  trailingSlash: true,           // /about/ -> /about/index.html
  reactStrictMode: true,
};

export default nextConfig;
