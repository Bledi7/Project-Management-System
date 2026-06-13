import type { FastifyRequest, FastifyReply } from 'fastify';
import { TeamsService } from './teams.service';
import { CreateTeamSchema, UpdateTeamSchema, AddMemberSchema } from './teams.schema';

export async function getAll(request: FastifyRequest, reply: FastifyReply) {
  return reply.send(await new TeamsService(request.server.prisma).findAll());
}

export async function getById(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  return reply.send(await new TeamsService(request.server.prisma).findById(Number(request.params.id)));
}

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const body = CreateTeamSchema.parse(request.body);
  const result = await new TeamsService(request.server.prisma).create(body, request.user.id);
  return reply.status(201).send(result);
}

export async function update(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const body = UpdateTeamSchema.parse(request.body);
  return reply.send(await new TeamsService(request.server.prisma).update(Number(request.params.id), body));
}

export async function remove(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  return reply.send(await new TeamsService(request.server.prisma).delete(Number(request.params.id)));
}

export async function addMember(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const body = AddMemberSchema.parse(request.body);
  return reply.send(await new TeamsService(request.server.prisma).addMember(Number(request.params.id), body));
}

export async function removeMember(
  request: FastifyRequest<{ Params: { id: string; userId: string } }>,
  reply: FastifyReply,
) {
  return reply.send(
    await new TeamsService(request.server.prisma).removeMember(
      Number(request.params.id),
      Number(request.params.userId),
    ),
  );
}
