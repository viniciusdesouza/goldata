import { NextRequest, NextResponse } from "next/server";
import Redis from "ioredis";

// Conecte ao Redis local
const redis = new Redis("redis://localhost:6379");

export async function GET(req: NextRequest) {
  // Teste de cache simples
  const valor = await redis.get("chave-teste");
  if (valor) {
    return NextResponse.json({ source: "cache", valor });
  }
  await redis.set("chave-teste", "funcionou!", "EX", 30); // expira em 30s
  return NextResponse.json({ source: "novo", valor: "funcionou!" });
}