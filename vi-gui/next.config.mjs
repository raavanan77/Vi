/** @type {import('next').NextConfig} */
const nextConfig = {
    env:{
        API_KEY: process.env.DJANGO_SERVER_URL
      }
};

export default nextConfig;
