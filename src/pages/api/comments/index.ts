import type { NextApiRequest, NextApiResponse } from "next";
import Comment from "@/database/models/Comment";
import dbConnect from "@/database/dbConnect";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  dbConnect().catch((_) => {
    res.status(500).json({ error: "Unable to connect to MongoDb" });
  });

  switch (req.method) {
    case "GET":
      return getComments(req, res);
    case "POST":
      return addComment(req, res);
    default:
      res.status(405).end();
  }
}

async function getComments(req: NextApiRequest, res: NextApiResponse) {
  const comments = await Comment.find({});
  res.json({ data: comments });
}

async function addComment(req: NextApiRequest, res: NextApiResponse) {
  try {
    const comment = new Comment(req.body);
    await comment.save();
    res.json({ data: comment });
  } catch (error) {
    res.status(400).json({ error });
  }
}
