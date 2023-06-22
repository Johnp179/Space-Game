import type { NextApiRequest, NextApiResponse } from "next";
import HighScore, { IHighScore } from "@/database/models/HighScore";
import User from "@/database/models/User";
import { connectDB } from "@/database/dbConnect";
import { addHighScore } from ".";

export default async function addHighScoreWhenUnAuthenticated(
  req: NextApiRequest,
  res: NextApiResponse<{ userExists: boolean } | { added: boolean }>
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }
  connectDB();
  const { username } = req.body as IHighScore;
  const userPromise = User.find({});
  const highScorePromise = HighScore.find({}, null, { sort: { score: -1 } });
  const [users, highScores] = await Promise.all([
    userPromise,
    highScorePromise,
  ]);

  for (const user of users) {
    if (user.username === username) {
      return res.json({
        userExists: true,
      });
    }
  }

  return addHighScore(highScores, req, res);
}
