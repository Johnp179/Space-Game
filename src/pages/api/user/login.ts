import type { NextApiRequest, NextApiResponse } from "next";
import User from "@/database/models/User";
import dbConnect from "@/database/dbConnect";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "@/lib/session";
import bcrypt from "bcrypt";
import { number } from "zod";

const waitInterval = 1 * 60 * 1000; // 1 minute

interface LoginError {
  email: boolean;
  password: boolean;
  attempts: boolean;
  timeTillReset: number;
}

async function login(req: NextApiRequest, res: NextApiResponse) {
  dbConnect().catch((_) => {
    res.status(500).json({ error: "Unable to connect to MongoDb" });
  });

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
    }
    if (user.loginAttempts >= 5) {
      error.attempts = true;
      throw error;
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      user.loginAttempts += 1;
      await user.save();
      error.timeTillReset =
        (waitInterval - (Date.now() - user.startTime)) / 1000;
      error.password = true;
      throw error;
    }

    req.session.user = {
      username: user.username,
      email: user.email,
    };
    await req.session.save();
    res.json(req.session.user);
  } catch (error) {
    res.status(401).json(error);
  }
}

export default withIronSessionApiRoute(login, sessionOptions);
