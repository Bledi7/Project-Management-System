import type { FastifyInstance } from 'fastify';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { register, login, approve, reject, me } from './auth.controller';

type IdParam = { Params: { id: string } };

export async function authRoutes(fastify: FastifyInstance) {
  // Public
  fastify.post('/register', register);
  fastify.post('/login', login);

  // Protected — current user
  fastify.get('/me', { preHandler: [authenticate] }, me);

  // Admin only
  fastify.patch<IdParam>('/approve/:id', { preHandler: [authenticate, authorize('ADMIN')] }, approve);
  fastify.patch<IdParam>('/reject/:id',  { preHandler: [authenticate, authorize('ADMIN')] }, reject);
}
