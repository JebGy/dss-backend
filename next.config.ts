import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  //desactiva el linting de las rutas
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
