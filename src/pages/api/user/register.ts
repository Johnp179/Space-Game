import type { NextApiRequest, NextApiResponse } from "next";
import User from "@/database/models/User";
import dbConnect from "@/database/dbConnect";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "@/lib/session";
import bcrypt from "bcrypt";

class RegisterError extends Error {
  name = "RegisterError";
  username: boolean;
  email: boolean;
  constructor(msg: string, username = false, email = false) {
    super(msg);
    this.username = username;
    this.email = email;
  }
}

export interface IRegisterError {
  username: boolean;
  email: boolean;
}

async function register(req: NextApiRequest, res: NextApiResponse) {
  dbConnect();

  const { username, email, password } = req.body;

  const error: IRegisterError = {
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
  } catch (error) {
    if (error instanceof Error) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
      res.status(401).json({ error });
    }
  }
}

export default withIronSessionApiRoute(register, sessionOptions);
