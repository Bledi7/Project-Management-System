import type { FastifyRequest, FastifyReply } from 'fastify';
import { ReportsService } from './reports.service';
import { CreateReportSchema, UpdateReportSchema } from './reports.schema';

export async function getAll(request: FastifyRequest, reply: FastifyReply) {
  const { id, role, team_id } = request.user;
  return reply.send(await new ReportsService(request.server.prisma).findAll(id, role, team_id));
}

export async function getById(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const { id: userId, role, team_id } = request.user;
  return reply.send(
    await new ReportsService(request.server.prisma).findById(Number(request.params.id), userId, role, team_id),
  );
}

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const body = CreateReportSchema.parse(request.body);
  const { id, role, team_id } = request.user;
  const result = await new ReportsService(request.server.prisma).create(body, id, role, team_id);
  return reply.status(201).send(result);
}

export async function update(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const body = UpdateReportSchema.parse(request.body);
  const { id: userId, role } = request.user;
  return reply.send(
    await new ReportsService(request.server.prisma).update(Number(request.params.id), body, userId, role),
  );
}

export async function remove(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const { id: userId, role } = request.user;
  return reply.send(
    await new ReportsService(request.server.prisma).delete(Number(request.params.id), userId, role),
  );
}
