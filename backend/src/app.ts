import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { ZodError } from 'zod';
import { env } from './config/env';
import prismaPlugin from './plugins/prisma';
import { AppError } from './utils/errors';

// Routes
import { authRoutes }       from './modules/auth/auth.routes';
import { usersRoutes }      from './modules/users/users.routes';
import { teamsRoutes }      from './modules/teams/teams.routes';
import { reportsRoutes }    from './modules/reports/reports.routes';
import { prioritiesRoutes } from './modules/priorities/priorities.routes';
import { jiraRoutes }       from './modules/jira/jira.routes';

const app = Fastify({ logger: true });

// ─── Plugins ──────────────────────────────────────────────────────────────────
app.register(cors, { origin: env.FRONTEND_URL, credentials: true });
app.register(jwt, { secret: env.JWT_SECRET });
app.register(prismaPlugin);

// ─── Global error handler ─────────────────────────────────────────────────────
app.setErrorHandler((error, _request, reply) => {
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({ error: error.message });
  }
  if (error instanceof ZodError) {
    return reply.status(400).send({
      error: 'Validation failed',
      details: error.flatten().fieldErrors,
    });
  }
  app.log.error(error);
  return reply.status(500).send({ error: 'Internal server error' });
});

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.register(authRoutes,       { prefix: '/api/auth' });
app.register(usersRoutes,      { prefix: '/api/users' });
app.register(teamsRoutes,      { prefix: '/api/teams' });
app.register(reportsRoutes,    { prefix: '/api/reports' });
app.register(prioritiesRoutes, { prefix: '/api/priorities' });
app.register(jiraRoutes,       { prefix: '/api/jira' });

export default app;
