import type { NextApiRequest, NextApiResponse } from "next";
import HighScore from "@/database/models/HighScore";
import dbConnect from "@/database/dbConnect";

const maxScores = 10;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  dbConnect().catch((_) => {
    res.status(500).json({ error: "Unable to connect to MongoDb" });
  });

  switch (req.method) {
    case "GET":
      return getHighScores(req, res);
    case "POST":
      return postHighScore(req, res);
    default:
      res.status(405).end();
  }
}

async function getHighScores(req: NextApiRequest, res: NextApiResponse) {
  const highScores = await HighScore.find({}, null, { sort: { score: -1 } });
  res.json({ data: highScores });
}

async function postHighScore(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { user1, score } = req.body;

    const highScores = await HighScore.find({}, null, {
      sort: { score: -1 },
    });

    const lowestScore = highScores[highScores.length - 1];

    if (highScores.length < maxScores) {
      const highScore = new HighScore(req.body);
      await highScore.save();
      return res.json({ added: true });
    }
    if (score > lowestScore.score) {
      lowestScore.user = user1;
      lowestScore.score = score;
      await lowestScore.save();
      return res.json({ added: true });
    }

    res.json({ added: false });
  } catch (error) {
    res.status(400).json({ error });
  }
}
