import type { NextApiRequest, NextApiResponse } from "next";
import Comment, { IComment } from "@/database/models/Comment";
import { connectDB } from "@/database/dbConnect";

export default async function getAndAddComments(
  req: NextApiRequest,
  res: NextApiResponse
) {
  connectDB();

  switch (req.method) {
    case "GET":
      return getComments(req, res);
    case "POST":
      return addComment(req, res);
    default:
      res.status(405).end();
  }
}

async function getComments(
  _: NextApiRequest,
  res: NextApiResponse<IComment[]>
) {
  const comments = await Comment.find({});
  res.json(comments);
}

async function addComment(req: NextApiRequest, res: NextApiResponse<string>) {
  try {
    await Comment.create(req.body);
    res.json("Document added");
  } catch (error) {
    console.error(error);
    if (error instanceof Error && error.name === "ValidationError") {
      return res.status(400).end();
    }
    res.status(500).end();
  }
}
