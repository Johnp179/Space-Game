import type { NextApiRequest, NextApiResponse } from "next";
import User from "@/database/models/User";
import { connectDB } from "@/database/dbConnect";
import { withIronSessionApiRoute } from "iron-session/next";
import { IUser, sessionOptions } from "@/lib/session";
import bcrypt from "bcrypt";

export interface LoginError {
  email: boolean;
  password: boolean;
  attempts: boolean;
  timeTillReset: number;
}

const waitInterval = 1 * 60 * 1000; // 1 minute
export const maxAttempts = 5;

async function login(
  req: NextApiRequest,
  res: NextApiResponse<{ user: IUser } | { error: LoginError }>
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }
  connectDB();

  const { email, password } = req.body;
  const error: LoginError = {
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

    if (user.loginAttempts >= maxAttempts) {
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
      console.error(error);
      return res.status(500).end();
    }
    res.status(401).json({ error: error as LoginError });
  }
}

export default withIronSessionApiRoute(login, sessionOptions);
