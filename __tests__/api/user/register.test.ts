import { connectDB, disconnectDB } from "@/database/dbConnect";
import User from "@/database/models/User";
import register from "@/pages/api/user/register";
import { createMocks } from "node-mocks-http";
import { RegisterError } from "@/pages/api/user/register";

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await disconnectDB();
});

describe("Tests for the register API", () => {
  const method = "POST";
  test("It should generate a username and email error ", async () => {
    const username = "jimmy ";
    const email = "jimmy@gmail.com";
    const password = "password";

    await User.create({
      username,
      email,
      password,
    });

    const error: RegisterError = {
      username: true,
      email: true,
    };

    const { req, res } = createMocks({
      method,
      body: {
        username,
        email,
        password,
      },
    });

    await register(req as any, res as any);
    expect(res._getJSONData()).toEqual({ error });
  });

  test("It should create a new user ", async () => {
    const user = {
      username: "john",
      email: "john@gmail.com",
    };
    const { req, res } = createMocks({
      method,
      body: {
        ...user,
        password: "password",
      },
    });

    await register(req as any, res as any);
    expect(res._getJSONData()).toEqual({ user });
    expect(res._getHeaders()["set-cookie"]).toBeTruthy();
  });
});
