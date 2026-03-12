import cors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import fastifyRateLimit from '@fastify/rate-limit';
import Fastify from 'fastify';
import { env } from './config/env';
import { prisma } from './prisma/client';
import { adminRoutes } from './routes/admin.routes';
import { authRoutes } from './routes/auth.routes';
import { publicScheduleRoutes } from './routes/public-schedule.routes';

function withWWW(link: string) {
  const splited = link.split(".");

  if (splited[0].endsWith("www")) return link;

  splited[0] = splited[0].replace(/^([a-z]+):\/\/([a-z]+)$/, "$1://www.$2");

  return splited.join(".");
}

function corsUrls(url: string): string[] {
  const treatedUrl = url.replace(/\/$/, "");

  return [treatedUrl, withWWW(treatedUrl)];
}

export async function buildApp() {
  const app = Fastify({
    logger: {
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      transport:
        process.env.NODE_ENV !== 'production'
          ? { target: 'pino-pretty', options: { colorize: true } }
          : undefined,
    },
  });

  // ── JWT ──────────────────────────────────────────────────────────────────────
  await app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
  });

  console.log(corsUrls(env.FRONTEND_URL));

  app.register(cors, {
    origin: [
      ...corsUrls(env.FRONTEND_URL),
    ],
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  });

  // ── Rate Limit (applied to public routes) ───────────────────────────────────
  await app.register(fastifyRateLimit, {
    global: false, // We apply manually per-scope
    max: 60,
    timeWindow: '1 minute',
  });

  // ── Health check ─────────────────────────────────────────────────────────────
  app.get('/health', async (_req, reply) => {
    return reply.status(200).send({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // ── Auth routes (/auth/*) ─────────────────────────────────────────────────
  await app.register(authRoutes, { prefix: '/auth' });

  // ── Public schedule routes (/schedules/*) with rate limit ─────────────────
  await app.register(
    async (publicApp) => {
      publicApp.addHook('onRequest', async (request, reply) => {
        try {
          // Apply rate limit to public routes
          await (app as any).rateLimit()(request, reply);
        } catch {
          // Rate limit plugin handles the reply
        }
      });

      await publicApp.register(publicScheduleRoutes, { prefix: '/schedules' });
    }
  );

  // ── Admin routes (/admin/*) ───────────────────────────────────────────────
  await app.register(adminRoutes, { prefix: '/admin' });

  // ── Graceful shutdown ─────────────────────────────────────────────────────
  const gracefulShutdown = async (signal: string) => {
    app.log.info(`Received ${signal}, shutting down gracefully...`);
    await app.close();
    await prisma.$disconnect();
    process.exit(0);
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  return app;
}
