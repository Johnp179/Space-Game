import type { NextApiRequest, NextApiResponse } from "next";
import User from "@/database/models/User";
import { connectDB } from "@/database/dbConnect";
import { withIronSessionApiRoute } from "iron-session/next";
import { IUser, sessionOptions } from "@/lib/session";
import bcrypt from "bcrypt";

export interface RegisterError {
  username: boolean;
  email: boolean;
}

async function register(
  req: NextApiRequest,
  res: NextApiResponse<{ user: IUser } | { error: RegisterError }>
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  connectDB();
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
    await User.create({ ...req.body, password: hashedPassword });

    req.session.user = {
      username,
      email,
    };
    await req.session.save();
    res.json({ user: req.session.user });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      return res.status(500).end();
    }
    res.status(401).json({ error: error as RegisterError });
  }
}

export default withIronSessionApiRoute(register, sessionOptions);
