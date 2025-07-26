/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'geral-jackboo.r954jc.easypanel.host',
        port: '',
        pathname: '/uploads/**', // Permite imagens da produção
      },
      {
        protocol: 'https',
        hostname: 'cdn.leonardo.ai',
        port: '',
        pathname: '/**', // Permite imagens direto do Leonardo
      },
      // --- LINHA ADICIONADA PARA DESENVOLVIMENTO LOCAL ---
      {
        protocol: 'http',
        hostname: 'localhost',
        // A porta é deixada em branco para permitir qualquer porta (ex: 3333, 8000)
      },
    ],
  },
};

export default nextConfig;