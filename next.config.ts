import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["offllama", "node-llama-cpp", "pdf-parse"],
};

export default nextConfig;
