import type { NextApiRequest, NextApiResponse } from "next";
import User, { DBUser } from "@/database/models/User";
import { connectDB } from "@/database/dbConnect";

export default async function getUsers(
  req: NextApiRequest,
  res: NextApiResponse<DBUser[]>
) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  await connectDB();
  const users = await User.find({});
  res.json(users);
}
