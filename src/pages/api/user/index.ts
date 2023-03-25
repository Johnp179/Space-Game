import type { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "@/lib/session";

async function getUser(req: NextApiRequest, res: NextApiResponse) {
  const { user } = req.session;
  if (user) return res.json({ user });
  res.status(401).end();
}

export default withIronSessionApiRoute(getUser, sessionOptions);
