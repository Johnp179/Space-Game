import { NextApiResponse } from "next";

export default function manageError(error: unknown, res: NextApiResponse) {
  if (error instanceof Error) {
    switch (error.name) {
      case "CastError":
        res.status(400);
        break;
      case "NotFoundError":
        res.status(404);
        break;
      default: {
        res.status(500);
      }
    }
    res.json({ error: error.message });
  }
}
