import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    staleTimes: {
      dynamic: 90,
      static: 300
    },
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" }
    ]
  },
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
  // env: {
  //   KINDE_SITE_URL: process.env.KINDE_SITE_URL ?? `https://crudify-theta.vercel.app`,
  //   KINDE_POST_LOGOUT_REDIRECT_URL:
  //     process.env.KINDE_POST_LOGOUT_REDIRECT_URL ?? `https://crudify-theta.vercel.app`,
  //   KINDE_POST_LOGIN_REDIRECT_URL:
  //     process.env.KINDE_POST_LOGIN_REDIRECT_URL ?? `https://crudify-theta.vercel.app/app/dashboard`
  // }
};

export default nextConfig;
