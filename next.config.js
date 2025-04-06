// next.config.js

/** @type {import('next').NextConfig} */
const defaultConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: [
      'images.unsplash.com',
      'avatars.githubusercontent.com',
      'lh3.googleusercontent.com',
      'github.com',
    ],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
    optimizePackageImports: [
      '@radix-ui/react-accordion',
      '@radix-ui/react-alert-dialog',
      '@radix-ui/react-aspect-ratio',
      '@radix-ui/react-avatar',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-collapsible',
      '@radix-ui/react-context-menu',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-hover-card',
      '@radix-ui/react-label',
      '@radix-ui/react-menubar',
      '@radix-ui/react-navigation-menu',
      '@radix-ui/react-popover',
      '@radix-ui/react-progress',
      '@radix-ui/react-radio-group',
      '@radix-ui/react-scroll-area',
      '@radix-ui/react-select',
      '@radix-ui/react-separator',
      '@radix-ui/react-slider',
      '@radix-ui/react-slot',
      '@radix-ui/react-switch',
      '@radix-ui/react-tabs',
      '@radix-ui/react-toast',
      '@radix-ui/react-toggle',
      '@radix-ui/react-toggle-group',
      '@radix-ui/react-tooltip',
      'lucide-react',
      'class-variance-authority',
      'clsx',
      'cmdk',
      'date-fns',
      'embla-carousel-react',
      'input-otp',
      'next-themes',
      'react-day-picker',
      'react-hook-form',
      'react-resizable-panels',
      'recharts',
      'sonner',
      'tailwind-merge',
      'vaul',
      'zod',
    ],
    serverComponentsExternalPackages: [],
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

// Try to load user configuration
let userConfig = undefined;
try {
  // For ESM environments
  userConfig = await import('./v0-user-next.config.mjs').catch(() => null);
} catch (e) {
  try {
    // For CJS environments
    userConfig = await import('./v0-user-next.config').catch(() => null);
  } catch (innerError) {
    // Ignore error
  }
}

// Create final config by merging default with user config
const nextConfig = { ...defaultConfig };

if (userConfig) {
  // ESM imports will have a "default" property
  const config = userConfig.default || userConfig;

  for (const key in config) {
    if (
      typeof nextConfig[key] === 'object' &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...config[key],
      };
    } else {
      nextConfig[key] = config[key];
    }
  }
}

export default nextConfig;