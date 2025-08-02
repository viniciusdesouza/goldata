import type { NextApiRequest, NextApiResponse } from "next";
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { league } = req.query;
  if (!league) return res.status(400).json({ error: "Missing league id" });

  const redisKey = `league-info:${league}`;
  let data = await redis.get(redisKey);

  if (data) {
    return res.status(200).json({ response: JSON.parse(data), cached: true });
  }

  // Se não existe no Redis, busca da API externa
  const apiRes = await fetch(`https://api-football-v1.p.rapidapi.com/v3/leagues?id=${league}`, {
    headers: { "x-rapidapi-key": process.env.APIFOOTBALL_KEY! }
  });
  const apiData = await apiRes.json();

  // Salva no Redis por 24h (ajuste se quiser)
  await redis.set(redisKey, JSON.stringify(apiData.response), "EX", 60 * 60 * 24);

  res.status(200).json({ response: apiData.response, cached: false });
}