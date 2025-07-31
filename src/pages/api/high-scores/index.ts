import type { NextApiRequest, NextApiResponse } from "next";
import HighScore, { IHighScore } from "@/database/models/HighScore";
import { connectDB } from "@/database/dbConnect";

export const maxScores = 10;

export default async function getAndAddHighScores(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDB();
  switch (req.method) {
    case "GET":
      return getHighScores(req, res);
    case "POST":
      return postHighScore(req, res);
    default:
      res.status(405).end();
  }
}

async function getHighScores(
  _: NextApiRequest,
  res: NextApiResponse<IHighScore[]>
) {
  const highScores = await HighScore.find({}, null, {
    sort: { score: -1 },
  });
  res.json(highScores as IHighScore[]);
}

export async function addHighScore(
  highScores: any[],
  req: NextApiRequest,
  res: NextApiResponse<{ added: boolean }>
) {
  const { username, score } = req.body as IHighScore;
  const lowestScore = highScores[highScores.length - 1];
  try {
    if (highScores.length < maxScores) {
      await HighScore.create(req.body);
      return res.json({
        added: true,
      });
    }
    if (score > lowestScore.score) {
      lowestScore.username = username;
      lowestScore.score = score;
      await lowestScore.save();
      return res.json({
        added: true,
      });
    }
    res.json({
      added: false,
    });
  } catch (error) {
    console.error(error);
    if (error instanceof Error && error.name === "ValidationError") {
      return res.status(400).end();
    }
    res.status(500).end();
  }
}

async function postHighScore(
  req: NextApiRequest,
  res: NextApiResponse<{ added: boolean }>
) {
  const highScores = await HighScore.find({}, null, {
    sort: { score: -1 },
  });

  return addHighScore(highScores, req, res);
}
