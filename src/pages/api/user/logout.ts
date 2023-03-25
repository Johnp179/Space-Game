import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "@/lib/session";
import { NextApiRequest, NextApiResponse } from "next";

function logout(req: NextApiRequest, res: NextApiResponse) {
  req.session.destroy();
  res.status(200).end();
}

export default withIronSessionApiRoute(logout, sessionOptions);
