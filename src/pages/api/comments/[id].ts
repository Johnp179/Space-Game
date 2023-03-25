import type { NextApiRequest, NextApiResponse } from "next";
import NotFoundError from "@/lib/NotFoundError";
import Comment from "@/database/models/Comment";
import dbConnect from "@/database/dbConnect";
import manageError from "@/lib/manageApiError";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  dbConnect();

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
    if (!comment) throw new NotFoundError("Comment not found");
    res.json({ data: comment });
  } catch (error) {
    manageError(error, res);
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
    if (!updatedComment) throw new NotFoundError("Comment not found");
    res.json({ data: updatedComment });
  } catch (error) {
    manageError(error, res);
  }
}

async function deleteComment(
  _: NextApiRequest,
  res: NextApiResponse,
  id: string
) {
  try {
    const deletedComment = await Comment.findByIdAndDelete(id);
    if (!deletedComment) throw new Error("Comment not found");
    res.json({ data: deletedComment });
  } catch (error) {
    manageError(error, res);
  }
}
