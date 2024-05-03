/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "development";
const nextConfig = {
  assetPrefix: isProd ? process.env.NEXT_PUBLIC_SERVICE_URL : undefined,
};

export default nextConfig;
