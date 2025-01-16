
export default (phase, { defaultConfig }) => {

  
  const nextConfig = {
    env:{
        DJANGO_SERVER_URL : "192.168.25.88",
        DJANGO_SERVER_PORT : "8000"
      }
  };

  return nextConfig;

}

