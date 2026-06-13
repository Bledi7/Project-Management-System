import type { FastifyRequest, FastifyReply } from 'fastify';
import type { Role } from '@prisma/client';

/**
 * Role-based guard — use after `authenticate`.
 * Usage: preHandler: [authenticate, authorize('ADMIN', 'PRODUCT_OWNER')]
 */
export function authorize(...roles: Role[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const userRole = request.user.role as Role;
    if (!roles.includes(userRole)) {
      reply.status(403).send({ error: 'Forbidden: insufficient permissions' });
    }
  };
}
