import type { FastifyInstance } from 'fastify';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { getAll, getById, create, update, updateStatus, remove } from './priorities.controller';

type IdParam = { Params: { id: string } };

export async function prioritiesRoutes(fastify: FastifyInstance) {
  const authGuard = { preHandler: [authenticate] };
  const poGuard   = { preHandler: [authenticate, authorize('PRODUCT_OWNER', 'ADMIN')] };

  fastify.get('/',                         authGuard, getAll);
  fastify.get<IdParam>('/:id',             authGuard, getById);
  fastify.post('/',                        poGuard,   create);
  fastify.put<IdParam>('/:id',             poGuard,   update);
  fastify.patch<IdParam>('/:id/status',    poGuard,   updateStatus);
  fastify.delete<IdParam>('/:id',          poGuard,   remove);
}
