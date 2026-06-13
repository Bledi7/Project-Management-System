import type { FastifyInstance } from 'fastify';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { getAll, getById, create, update, remove, addMember, removeMember } from './teams.controller';

type IdParam       = { Params: { id: string } };
type MemberParam   = { Params: { id: string; userId: string } };

export async function teamsRoutes(fastify: FastifyInstance) {
  const adminGuard = { preHandler: [authenticate, authorize('ADMIN')] };
  const authGuard  = { preHandler: [authenticate] };

  fastify.get('/',                          authGuard,  getAll);
  fastify.get<IdParam>('/:id',              authGuard,  getById);

  fastify.post('/',                         adminGuard, create);
  fastify.put<IdParam>('/:id',              adminGuard, update);
  fastify.delete<IdParam>('/:id',           adminGuard, remove);
  fastify.post<IdParam>('/:id/members',     adminGuard, addMember);
  fastify.delete<MemberParam>('/:id/members/:userId', adminGuard, removeMember);
}
