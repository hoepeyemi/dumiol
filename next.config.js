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
      // Add lottie-web to externals
      config.externals = [...(config.externals || []), 'lottie-web'];
      
      // Replace lottie-web with our mock during server-side rendering
      config.resolve.alias = {
        ...config.resolve.alias,
        'lottie-web': require.resolve('./src/mocks/lottie-web-mock.js'),
      };
    }
    
    return config;
  },
};

module.exports = nextConfig;