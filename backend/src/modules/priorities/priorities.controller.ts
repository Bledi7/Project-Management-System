import type { FastifyRequest, FastifyReply } from 'fastify';
import { PrioritiesService } from './priorities.service';
import { CreatePrioritySchema, UpdatePrioritySchema, UpdateStatusSchema } from './priorities.schema';

export async function getAll(request: FastifyRequest, reply: FastifyReply) {
  const { role, team_id } = request.user;
  return reply.send(await new PrioritiesService(request.server.prisma).findAll(role, team_id));
}

export async function getById(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const { role, team_id } = request.user;
  return reply.send(
    await new PrioritiesService(request.server.prisma).findById(
      Number(request.params.id),
      role,
      team_id,
    ),
  );
}

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const body = CreatePrioritySchema.parse(request.body);
  const result = await new PrioritiesService(request.server.prisma).create(body, request.user.id);
  return reply.status(201).send(result);
}

export async function update(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const body = UpdatePrioritySchema.parse(request.body);
  return reply.send(await new PrioritiesService(request.server.prisma).update(Number(request.params.id), body));
}

export async function updateStatus(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const body = UpdateStatusSchema.parse(request.body);
  const { role, team_id } = request.user;
  return reply.send(
    await new PrioritiesService(request.server.prisma).updateStatus(
      Number(request.params.id),
      body,
      role,
      team_id,
    ),
  );
}

export async function remove(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  return reply.send(await new PrioritiesService(request.server.prisma).delete(Number(request.params.id)));
}
