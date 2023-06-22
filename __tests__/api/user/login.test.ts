import { connectDB, disconnectDB } from "@/database/dbConnect";
import User from "@/database/models/User";
import { createMocks } from "node-mocks-http";
import login, { LoginError, maxAttempts } from "@/pages/api/user/login";
import register from "@/pages/api/user/register";
import Register from "@/pages/register";
import bcrypt from "bcrypt";
import { createUser } from "@/lib/testFunctions";

const username = "jimmy";
const email = "jimmy@gmail.com";
const password = "password";

beforeAll(async () => {
  await connectDB();
  await createUser(username, email, password);
});

afterAll(async () => {
  await disconnectDB();
});

describe("Tests for the login API ", () => {
  const method = "POST";

  test("It should login a user", async () => {
    const { req, res } = createMocks({
      method,
      body: {
        email,
        password,
      },
    });

    await login(req as any, res as any);
    expect(res._getStatusCode()).toBe(200);
  });

  test("It should fail because the user does not exist", async () => {
    const { req, res } = createMocks({
      method,
      body: {
        email: "random@gmail.com",
        password: "password",
      },
    });

    await login(req as any, res as any);
    const { error } = res._getJSONData();
    expect((error as LoginError).email).toBe(true);
  });

  test("It should fail because the password is incorrect", async () => {
    const { req, res } = createMocks({
      method,
      body: {
        email,
        password: "wrong-password",
      },
    });

    await login(req as any, res as any);
    const { error } = res._getJSONData();
    expect((error as LoginError).password).toBe(true);
  });

  test("It should fail because of too many attempts", async () => {
    async function getResponse() {
      const { req, res } = createMocks({
        method,
        body: {
          email,
          password: "wrong-password",
        },
      });
      await login(req as any, res as any);
      return res;
    }

    let res: any;
    for (let i = 0; i < maxAttempts; i++) {
      res = await getResponse();
    }
    const { error } = res._getJSONData();
    expect((error as LoginError).attempts).toBe(true);
  });
});
