import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

const ENFORCE_AUTH = process.env.ENFORCE_AUTH === "true";

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    await request.jwtVerify();
  } catch {
    if (ENFORCE_AUTH) {
      return reply.status(401).send({ error: "Unauthorized" });
    }
    (request as FastifyRequest & { user: unknown }).user = {
      id: "dev-user",
      email: "dev@localhost",
    };
  }
}

export function registerAuthHook(app: FastifyInstance) {
  app.decorate("authenticate", authenticate);
}
