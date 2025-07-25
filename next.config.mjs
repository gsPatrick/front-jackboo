
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
           {
        protocol: 'https',
        hostname: 'cdn.leonardo.ai',
        port: '',
        // O 'pathname' com '**' permite qualquer caminho de imagem nesse domínio.
        pathname: '/**', 
      }
    ],
  },
};

export default nextConfig;