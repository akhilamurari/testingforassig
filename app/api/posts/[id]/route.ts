export const runtime = 'nodejs';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

function getId(ctx: unknown) {
  const idStr = (ctx as { params?: { id?: string }}).params?.id;
  const id = Number(idStr);
  return idStr && !Number.isNaN(id) ? id : null;
}
export async function GET(_req: Request, ctx: unknown) {
  const id = getId(ctx); if (id===null) return new Response('Bad id', {status:400});
  const post = await prisma.post.findUnique({ where: { id }});
  if (!post) return new Response('Not Found', { status: 404 });
  return Response.json(post);
}
export async function PUT(req: Request, ctx: unknown) {
  const id = getId(ctx); if (id===null) return new Response('Bad id', {status:400});
  const body = (await req.json()) as { title?: string; content?: string };
  const post = await prisma.post.update({ where: { id }, data: body });
  return Response.json(post);
}
export async function DELETE(_req: Request, ctx: unknown) {
  const id = getId(ctx); if (id===null) return new Response('Bad id', {status:400});
  await prisma.post.delete({ where: { id }});
  return new Response(null, { status: 204 });
}
