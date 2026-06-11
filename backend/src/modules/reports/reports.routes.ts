import type { FastifyInstance } from 'fastify';
import { authenticate } from '../../middleware/authenticate';
import { getAll, getById, create, update, remove } from './reports.controller';

type IdParam = { Params: { id: string } };

export async function reportsRoutes(fastify: FastifyInstance) {
  // All report routes require authentication; role logic is handled in the service
  const authGuard = { preHandler: [authenticate] };

  fastify.get('/',               authGuard, getAll);
  fastify.get<IdParam>('/:id',   authGuard, getById);
  fastify.post('/',              authGuard, create);
  fastify.put<IdParam>('/:id',   authGuard, update);
  fastify.delete<IdParam>('/:id', authGuard, remove);
}
