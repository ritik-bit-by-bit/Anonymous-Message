/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
      OPENAI_API_KEY: process.env.OPENAI_API_KEY, // Ensure the API key is loaded in the environment
    },
    // Optionally you could add any other server-side specific configurations here
  };
  
  export default nextConfig;
  