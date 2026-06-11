import type { FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from './auth.service';
import { RegisterSchema, LoginSchema } from './auth.schema';
import { env } from '../../config/env';

// ─── Register ─────────────────────────────────────────────────────────────────
export async function register(request: FastifyRequest, reply: FastifyReply) {
  const body = RegisterSchema.parse(request.body);
  const service = new AuthService(request.server.prisma);
  const result = await service.register(body);
  return reply.status(201).send(result);
}

// ─── Login ────────────────────────────────────────────────────────────────────
export async function login(request: FastifyRequest, reply: FastifyReply) {
  const body = LoginSchema.parse(request.body);
  const service = new AuthService(request.server.prisma);
  const payload = await service.login(body);

  const token = request.server.jwt.sign(payload, { expiresIn: env.JWT_EXPIRES_IN });

  return reply.send({ token, user: payload });
}

// ─── Approve (Admin only) ─────────────────────────────────────────────────────
export async function approve(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const service = new AuthService(request.server.prisma);
  const user = await service.approve(Number(request.params.id));
  return reply.send(user);
}

// ─── Reject (Admin only) ──────────────────────────────────────────────────────
export async function reject(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const service = new AuthService(request.server.prisma);
  const user = await service.reject(Number(request.params.id));
  return reply.send(user);
}

// ─── Me ───────────────────────────────────────────────────────────────────────
export async function me(request: FastifyRequest, reply: FastifyReply) {
  const service = new AuthService(request.server.prisma);
  const user = await service.me(request.user.id);
  return reply.send(user);
}
