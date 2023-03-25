import type { NextApiRequest, NextApiResponse } from "next";
import User from "@/database/models/User";
import dbConnect from "@/database/dbConnect";

export default async function getUsers(
  _: NextApiRequest,
  res: NextApiResponse
) {
  dbConnect();

  const users = await User.find({});
  res.json({ data: users });
}
