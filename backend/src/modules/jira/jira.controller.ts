import type { FastifyRequest, FastifyReply } from 'fastify';
import { JiraService } from './jira.service';

export async function getProjects(_request: FastifyRequest, reply: FastifyReply) {
  return reply.send(await new JiraService().getProjects());
}

export async function getProjectStats(
  request: FastifyRequest<{ Params: { key: string } }>,
  reply: FastifyReply,
) {
  return reply.send(await new JiraService().getProjectStats(request.params.key));
}

export async function getProjectOverview(
  request: FastifyRequest<{ Params: { key: string } }>,
  reply: FastifyReply,
) {
  return reply.send(await new JiraService().getProjectOverview(request.params.key));
}

export async function getProjectIssues(
  request: FastifyRequest<{ Params: { key: string }; Querystring: { jql?: string; maxResults?: string; startAt?: string } }>,
  reply: FastifyReply,
) {
  const { jql, maxResults, startAt } = request.query;
  return reply.send(
    await new JiraService().getProjectIssues(
      request.params.key,
      jql,
      maxResults ? Number(maxResults) : 50,
      startAt ? Number(startAt) : 0,
    ),
  );
}

export async function getSprints(
  request: FastifyRequest<{ Params: { boardId: string } }>,
  reply: FastifyReply,
) {
  return reply.send(await new JiraService().getSprints(request.params.boardId));
}
