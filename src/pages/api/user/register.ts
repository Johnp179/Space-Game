import type { NextApiRequest, NextApiResponse } from "next";
import User from "@/database/models/User";
import dbConnect from "@/database/dbConnect";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "@/lib/session";
import bcrypt from "bcrypt";

interface RegisterError {
  username: boolean;
  email: boolean;
}

async function register(req: NextApiRequest, res: NextApiResponse) {
  dbConnect().catch((_) => {
    res.status(500).json({ error: "Unable to connect to MongoDb" });
  });

  const { username, email, password } = req.body;

  const error: RegisterError = {
    username: false,
    email: false,
  };
  try {
    let user;
    user = await User.findOne({ email });
    if (user) error.email = true;
    user = await User.findOne({ username });
    if (user) error.username = true;

    if (error.username || error.email) {
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ ...req.body, password: hashedPassword });
    await user.save();

    req.session.user = {
      username,
      email,
    };
    await req.session.save();
    res.json(req.session.user);
  } catch (error: any) {
    if ("username" in error && "email" in error) {
      res
        .status(401)
        .json({ error: "That username or password already exists" });
    }
    res.status(400).json({ error });
  }
}

export default withIronSessionApiRoute(register, sessionOptions);
