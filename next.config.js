// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   webpack: config => {
//     config.externals.push('pino-pretty', 'lokijs', 'encoding')
//     return config
//   },
// };

// module.exports = nextConfig;


/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Preserve existing fallback configuration
    config.resolve.fallback = { fs: false, net: false, tls: false };
    
    // Handle lottie-web issue with SSR
    if (isServer) {
      config.externals = [...(config.externals || []), 'lottie-web'];
    }
    
    return config;
  },
};

module.exports = nextConfig;