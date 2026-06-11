import type { FastifyInstance } from 'fastify';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { getAll, getById, create, update, remove } from './users.controller';

type IdParam = { Params: { id: string } };

export async function usersRoutes(fastify: FastifyInstance) {
  // All user routes require ADMIN role
  const adminGuard = { preHandler: [authenticate, authorize('ADMIN')] };

  fastify.get('/',           adminGuard, getAll);
  fastify.get<IdParam>('/:id',   adminGuard, getById);
  fastify.post('/',          adminGuard, create);
  fastify.put<IdParam>('/:id',   adminGuard, update);
  fastify.delete<IdParam>('/:id', adminGuard, remove);
}
