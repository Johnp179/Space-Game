import type { NextApiRequest, NextApiResponse } from "next";
import NotFoundError from "@/lib/NotFoundError";
import Comment, { IComment } from "@/database/models/Comment";
import { connectDB } from "@/database/dbConnect";

export default async function getAndAlterComments(
  req: NextApiRequest,
  res: NextApiResponse
) {
  connectDB();

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
  } else {
    console.log("ID is not a string");
    res.status(400).end();
  }
}

async function getComment(
  req: NextApiRequest,
  res: NextApiResponse<IComment>,
  id: string
) {
  try {
    const comment = await Comment.findById(id);
    if (!comment) {
      throw new NotFoundError(
        "Document corresponding to that ID does not exist"
      );
    }
    res.json(comment);
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

async function updateComment(
  req: NextApiRequest,
  res: NextApiResponse<string>,
  id: string
) {
  try {
    const updatedComment = await Comment.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedComment) {
      throw new NotFoundError(
        "Document corresponding to that ID does not exist"
      );
    }
    res.json(`Document updated`);
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

async function deleteComment(
  _: NextApiRequest,
  res: NextApiResponse<string>,
  id: string
) {
  try {
    const deletedComment = await Comment.findByIdAndDelete(id);
    if (!deletedComment) {
      throw new NotFoundError(
        "Document corresponding to that ID does not exist"
      );
    }
    res.json("Document deleted");
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
