import type { NextApiRequest, NextApiResponse } from "next";
import HighScore, { IHighScore } from "@/database/models/HighScore";
import { connectDB } from "@/database/dbConnect";
import NotFoundError from "@/lib/NotFoundError";
import { z } from "zod";

const Validator = z.object({
  username: z.string(),
  score: z.number(),
});

export default function alterHighScores(
  req: NextApiRequest,
  res: NextApiResponse
) {
  connectDB();

  const { id } = req.query;
  if (typeof id === "string") {
    switch (req.method) {
      case "PUT":
        return updateHighScore(req, res, id);
      case "DELETE":
        return deleteHighScore(req, res, id);
      default:
        res.status(405).end();
    }
  } else {
    console.log("ID is not a string");
    res.status(400).end();
  }
}

async function updateHighScore(
  req: NextApiRequest,
  res: NextApiResponse<IHighScore>,
  id: string
) {
  try {
    const highScore = Validator.parse(req.body);
    const updatedScore = await HighScore.findByIdAndUpdate(id, highScore, {
      new: true,
    });
    if (!updatedScore) {
      throw new NotFoundError(
        "Document corresponding to that ID does not exist"
      );
    }
    res.json(updatedScore);
  } catch (error) {
    console.error(error);
    if (
      (error instanceof Error &&
        (error.name === "CastError" || error.name === "NotFoundError")) ||
      error instanceof z.ZodError
    ) {
      return res.status(400).end();
    }
    res.status(500).end();
  }
}

async function deleteHighScore(
  _: NextApiRequest,
  res: NextApiResponse<string>,
  id: string
) {
  try {
    const deletedScore = await HighScore.findByIdAndDelete(id);
    if (!deletedScore) {
      throw new NotFoundError(
        "Document corresponding to that ID does not exist"
      );
    }
    res.json(`Document deleted`);
  } catch (error) {
    console.error(error);
    if (
      error instanceof Error &&
      (error.name === "CastError" || error.name === "NotFoundError")
    ) {
      return res.status(400).end();
    }
    res.status(500).end();
  }
}
