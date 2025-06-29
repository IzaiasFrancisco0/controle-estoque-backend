import 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    cookies: Record<string, string>;
    user?: {
      usuario: string;
      iat: number;
      exp: number;
    };
  }
}
