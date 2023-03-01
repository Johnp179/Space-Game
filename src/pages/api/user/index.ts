import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/database/dbConnect";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "@/lib/session";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  dbConnect().catch((_) => {
    res.status(500).json({ error: "Unable to connect to MongoDb" });
  });

  switch (req.method) {
    case "GET":
      return getUser(req, res);
    default:
      res.status(405).end();
  }
}

function getUser(req: NextApiRequest, res: NextApiResponse) {
  const { user } = req.session;
  if (user) return res.json({ user });
  res.status(401);
}

export default withIronSessionApiRoute(handler, sessionOptions);
