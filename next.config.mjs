/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: "/notes",
  images: { unoptimized: true }
};

export default nextConfig;
