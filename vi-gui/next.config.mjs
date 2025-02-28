export default (phase, { defaultConfig }) => {
  const nextConfig = {
    env: {
      DJANGO_SERVER_URL: "localhost",
      DJANGO_SERVER_PORT: "8000",
    },
  };

  return nextConfig;
};
