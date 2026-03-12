import type { FastifyReply, FastifyRequest } from 'fastify';

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch {
    return reply.status(401).send({ error: 'Token inválido ou expirado' });
  }
}

export async function requireAdmin(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();

    const user = request.user as { sub: string; role: string; };

    if (user.role !== 'ADMIN') {
      return reply.status(403).send({ error: 'Acesso negado: apenas administradores' });
    }
  } catch {
    return reply.status(401).send({ error: 'Token inválido ou expirado' });
  }
}
