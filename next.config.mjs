/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        "pnd.cciofficial.com",
        "61.19.247.202:4004",
        "http://61.19.247.202:4004",
        "https://pnd.cciofficial.com",
      ],
    },
  },
};

export default nextConfig;
