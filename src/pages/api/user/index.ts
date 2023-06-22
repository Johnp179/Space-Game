import type { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { IUser, sessionOptions } from "@/lib/session";

async function getUser(req: NextApiRequest, res: NextApiResponse<IUser>) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }
  const { user } = req.session;
  if (user) return res.json(user);
  res.status(401).end();
}

export default withIronSessionApiRoute(getUser, sessionOptions);
