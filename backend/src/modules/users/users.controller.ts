import type { FastifyRequest, FastifyReply } from 'fastify';
import { UsersService } from './users.service';
import { CreateUserSchema, UpdateUserSchema } from './users.schema';

export async function getAll(request: FastifyRequest, reply: FastifyReply) {
  const service = new UsersService(request.server.prisma);
  return reply.send(await service.findAll());
}

export async function getById(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  console.log('request :>> ', request);
  const service = new UsersService(request.server.prisma);
  return reply.send(await service.findById(Number(request.params.id)));
}

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const body = CreateUserSchema.parse(request.body);
  const service = new UsersService(request.server.prisma);
  return reply.status(201).send(await service.create(body));
}

export async function update(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const body = UpdateUserSchema.parse(request.body);
  const service = new UsersService(request.server.prisma);
  return reply.send(await service.update(Number(request.params.id), body));
}

export async function remove(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const service = new UsersService(request.server.prisma);
  return reply.send(await service.delete(Number(request.params.id)));
}
