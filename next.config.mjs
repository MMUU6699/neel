/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use an explicit ASSET_PREFIX environment variable in production when you
  // host assets on an external CDN. If ASSET_PREFIX is not set, leave
  // `assetPrefix` undefined so Next.js serves static assets from the same
  // origin (prevents ERR_NAME_NOT_RESOLVED when a placeholder domain is left).
  assetPrefix:
    process.env.NODE_ENV === "production"
      ? process.env.ASSET_PREFIX || undefined
      : undefined,
  output: "standalone",
  outputFileTracingIncludes: {
    "/api/scrape": ["./node_modules/undici/**/*"],
    "/api/scrape/anime": ["./node_modules/undici/**/*"],
  },
  redirects: async () => {
    return [
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
      {
        source: "/movie",
        destination: "/movies",
        permanent: true,
      },
      {
        source: "/tv",
        destination: "/tvshows",
        permanent: true,
      },
      {
        source: "/movies/top_rated",
        destination: "/movies?view=top_rated",
        permanent: true,
      },
    ];
  },
  rewrites: async () => {
    return [
      {
        source: "/assets/client-runtime.js",
        destination: "https://cloud.umami.is/script.js",
      },
      {
        source: "/client/api/send",
        destination: "https://gateway.umami.is/api/send",
      },
    ];
  },

  images: {
    unoptimized: true,
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "github.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "s4.anilist.co",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    taint: true,
    browserDebugInfoInTerminal: process.env.NODE_ENV !== "production",
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  // Ensure transpilation for older webOS Chromium
  transpilePackages: [
    "gsap",
    "react-three-fiber",
    "@react-three/drei",
    "three",
    "@noriginmedia/norigin-spatial-navigation"
  ],
};

export default nextConfig;
