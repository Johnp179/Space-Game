import type { NextApiRequest, NextApiResponse } from "next";
import HighScore from "@/database/models/HighScore";
import dbConnect from "@/database/dbconnect";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  dbConnect().catch((e) => console.error(e));

  switch (req.method) {
    case "GET":
      return getHighScores(req, res);
    case "POST":
      return postHighScore(req, res);
    default:
      return res.status(400).end();
  }
}

async function getHighScores(req: NextApiRequest, res: NextApiResponse) {
  try {
    const highScores = await HighScore.find({}, null, { sort: { score: -1 } });
    res.status(200).json({ highScores });
  } catch (error) {
    res.status(400).json({ success: false });
  }
}

async function postHighScore(req: NextApiRequest, res: NextApiResponse) {
  try {
    const highScores = await HighScore.find({});
    res.status(200).json({ data: highScores });
  } catch (error) {
    res.status(400).json({ success: false });
  }
}
