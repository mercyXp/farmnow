import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@farmnow/domain", "@farmnow/database"],
  serverExternalPackages: ["exceljs", "@react-pdf/renderer"],
};

export default nextConfig;
