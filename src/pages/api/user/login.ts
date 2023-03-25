import type { NextApiRequest, NextApiResponse } from "next";
import User from "@/database/models/User";
import dbConnect from "@/database/dbConnect";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "@/lib/session";
import bcrypt from "bcrypt";

const waitInterval = 1 * 60 * 1000; // 1 minute
export interface ILoginError {
  email: boolean;
  password: boolean;
  attempts: boolean;
  timeTillReset: number;
}

async function login(req: NextApiRequest, res: NextApiResponse) {
  dbConnect();

  const { email, password } = req.body;
  const error: ILoginError = {
    email: false,
    password: false,
    attempts: false,
    timeTillReset: 0,
  };

  try {
    const user = await User.findOne({ email });
    if (!user) {
      error.email = true;
      throw error;
    }
    if (Date.now() - user.startTime > waitInterval) {
      user.loginAttempts = 0;
      user.startTime = Date.now();
      await user.save();
    }

    error.timeTillReset = (waitInterval - (Date.now() - user.startTime)) / 1000;

    if (user.loginAttempts >= 5) {
      error.attempts = true;
      throw error;
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      user.loginAttempts++;
      await user.save();
      error.password = true;
      throw error;
    }
    req.session.user = {
      username: user.username,
      email: user.email,
    };
    await req.session.save();
    res.json({ user: req.session.user });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    res.status(401).json({ error });
  }
}

export default withIronSessionApiRoute(login, sessionOptions);
