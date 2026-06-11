import type { FastifyRequest, FastifyReply } from 'fastify';

// Extend @fastify/jwt types so request.user is typed throughout the app
declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { id: number; name: string; email: string; role: string; team_id: number | null };
    user:    { id: number; name: string; email: string; role: string; team_id: number | null };
  }
}

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch {
    reply.status(401).send({ error: 'Unauthorized — invalid or missing token' });
  }
}
