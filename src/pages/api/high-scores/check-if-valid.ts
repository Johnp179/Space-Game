import type { NextApiRequest, NextApiResponse } from "next";
import HighScore from "@/database/models/HighScore";
import { connectDB } from "@/database/dbConnect";
import { maxScores } from ".";
import { IHighScore } from "@/database/models/HighScore";

export default async function checkIfValidHighScore(
  req: NextApiRequest,
  res: NextApiResponse<{ highScore: boolean }>
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  connectDB();
  const { score } = req.body as IHighScore;
  const highScores = await HighScore.find({}, null, { sort: { score: -1 } });
  const lowestScore = highScores[highScores.length - 1] as IHighScore;
  if (highScores.length < maxScores || score > lowestScore.score) {
    return res.json({
      highScore: true,
    });
  }

  res.json({
    highScore: false,
  });
}
