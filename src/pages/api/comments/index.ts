import type { NextApiRequest, NextApiResponse } from "next";
import Comment from "@/database/models/Comment";
import dbConnect from "@/database/dbConnect";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  dbConnect();

  switch (req.method) {
    case "GET":
      return getComments(req, res);
    case "POST":
      return addComment(req, res);
    default:
      res.status(405).end();
  }
}

async function getComments(_: NextApiRequest, res: NextApiResponse) {
  try {
    throw new Error("bad things");
    const comments = await Comment.find({}, null, { maxTimeMS: 5000 });
    res.json({ data: comments });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    }
  }
}

async function addComment(req: NextApiRequest, res: NextApiResponse) {
  try {
    // await wait();
    // throw new Error("this is and artificial error that i just added for funz!");
    const comment = new Comment(req.body);
    await comment.save();
    res.json({ data: comment });
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "ValidationError") {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }
}

function wait() {
  return new Promise((resolve) => setTimeout(resolve, 2000));
}
