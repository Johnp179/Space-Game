import type { NextApiRequest, NextApiResponse } from "next";
import User from "@/database/models/User";
import dbConnect from "@/database/dbConnect";

export default async function getUsers(
  req: NextApiRequest,
  res: NextApiResponse
) {
  dbConnect().catch((_) => {
    res.status(500).json({ error: "Unable to connect to MongoDb" });
  });

  const users = await User.find({});
  res.json({ data: users });
}
