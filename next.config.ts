import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  trailingSlash: false,
  productionBrowserSourceMaps: true,
  enablePrerenderSourceMaps: true,
};

export default nextConfig;
