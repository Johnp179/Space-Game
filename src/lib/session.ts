import type { IronSessionOptions } from "iron-session";

interface User {
  username: string;
  email: string;
}

if (!process.env.SECRET_COOKIE_PASSWORD) {
  throw new Error("Please define the secret environment variable");
}

export const sessionOptions: IronSessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: "iron-session/examples/next.js",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

declare module "iron-session" {
  interface IronSessionData {
    user?: User;
  }
}
