import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "@/lib/session";
import { NextApiRequest, NextApiResponse } from "next";

function logout(req: NextApiRequest, res: NextApiResponse<string>) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }
  req.session.destroy();
  res.json("User successfully logged out");
}

export default withIronSessionApiRoute(logout, sessionOptions);
