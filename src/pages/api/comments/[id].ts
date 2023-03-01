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

  const { id } = req.query;

  if (typeof id === "string") {
    switch (req.method) {
      case "GET":
        return getComment(req, res, id);
      case "PUT":
        return updateComment(req, res, id);
      case "DELETE":
        return deleteComment(req, res, id);
      default:
        res.status(405).end();
    }
  }
}

async function getComment(
  req: NextApiRequest,
  res: NextApiResponse,
  id: string
) {
  try {
    const comment = await Comment.findById(id);
    if (!comment) throw new Error("Comment not found");
    res.json({ data: comment });
  } catch (error) {
    if (error instanceof Error) {
      res.status(404).json({ error: error.message });
    }
  }
}

async function updateComment(
  req: NextApiRequest,
  res: NextApiResponse,
  id: string
) {
  try {
    const updatedComment = await Comment.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedComment) throw new Error("Comment not found");
    res.json({ data: updatedComment });
  } catch (error) {
    if (error instanceof Error) {
      res.status(404).json({ error: error.message });
    }
  }
}

async function deleteComment(
  req: NextApiRequest,
  res: NextApiResponse,
  id: string
) {
  try {
    const deletedComment = await Comment.findByIdAndDelete(id);
    if (!deletedComment) throw new Error("Comment not found");
    res.status(200).json({ data: deletedComment });
  } catch (error) {
    if (error instanceof Error) {
      res.status(404).json({ error: error.message });
    }
  }
}
