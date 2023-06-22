import type { NextApiRequest, NextApiResponse } from "next";

export default async function dummy(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  res.json("hello world");
}
