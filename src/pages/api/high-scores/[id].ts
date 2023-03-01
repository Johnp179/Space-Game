import type { NextApiRequest, NextApiResponse } from "next";
import HighScore from "@/database/models/HighScore";
import dbConnect from "@/database/dbConnect";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  dbConnect().catch((_) => {
    res.status(500).json({ error: "Unable to connect to MongoDb" });
  });

  const { id } = req.query;
  if (typeof id === "string") {
    switch (req.method) {
      case "PUT":
        return updateHighScore(req, res, id);
      default:
        res.status(405).end();
    }
  }
}

async function updateHighScore(
  req: NextApiRequest,
  res: NextApiResponse,
  id: string
) {
  try {
    const updatedScore = await HighScore.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedScore) throw new Error("Comment not found");
    res.json({ data: updatedScore });
  } catch (error) {
    if (error instanceof Error) {
      res.status(404).json({ error: error.message });
    }
    res.status(400).json({ error });
  }
}
