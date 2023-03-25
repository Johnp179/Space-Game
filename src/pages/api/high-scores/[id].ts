import type { NextApiRequest, NextApiResponse } from "next";
import HighScore from "@/database/models/HighScore";
import dbConnect from "@/database/dbConnect";
import manageError from "@/lib/manageApiError";
import NotFoundError from "@/lib/NotFoundError";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  dbConnect();

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
    if (!updatedScore) throw new NotFoundError("Comment not found");
    res.json({ data: updatedScore });
  } catch (error) {
    manageError(error, res);
  }
}
