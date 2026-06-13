import type { FastifyInstance } from 'fastify';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { getProjects, getProjectStats, getProjectOverview, getProjectIssues, getSprints } from './jira.controller';

type KeyParam     = { Params: { key: string } };
type BoardParam   = { Params: { boardId: string } };
type IssuesQuery  = {
  Params: { key: string };
  Querystring: { jql?: string; maxResults?: string; startAt?: string };
};

export async function jiraRoutes(fastify: FastifyInstance) {
  const authOnly = { preHandler: [authenticate] };
  // Read-only Jira routes are available to any authenticated user.
  const readOnly = { preHandler: [authenticate] };
  // Mutate-heavy routes stay PO/Admin-only.
  const guard = { preHandler: [authenticate, authorize('PRODUCT_OWNER', 'ADMIN')] };

  fastify.get('/projects',                         authOnly, getProjects);
  fastify.get<KeyParam>('/projects/:key/stats',     readOnly, getProjectStats);
  fastify.get<KeyParam>('/projects/:key/overview',  readOnly, getProjectOverview);
  fastify.get<IssuesQuery>('/projects/:key/issues', readOnly, getProjectIssues);
  fastify.get<BoardParam>('/boards/:boardId/sprints', guard, getSprints);
}
