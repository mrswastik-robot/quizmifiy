/** @type {import('next').NextConfig} */
const nextConfig = {
    // appDir: true,
    images: {
        domains: ["lh3.googleusercontent.com", "avatars.githubusercontent.com"],
      },
      typescript: {
        ignoreBuildErrors: true,
      },
      eslint: {
        ignoreDuringBuilds: true,
      },
}

module.exports = nextConfig
