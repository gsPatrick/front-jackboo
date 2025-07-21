
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'geral-jackboo.r954jc.easypanel.host',
        port: '',
        pathname: '/uploads/**', // Permite todas as imagens da pasta uploads
      },
    ],
  },
};

export default nextConfig;