import { connectDB, disconnectDB } from "@/database/dbConnect";
import User from "@/database/models/User";
import { createMocks } from "node-mocks-http";
import login, { LoginError, maxAttempts } from "@/pages/api/user/login";
import getUser from "@/pages/api/user";
import { createUser } from "@/lib/testFunctions";

const username = "jimmy";
const email = "jimmy@gmail.com";
const password = "password";

async function getCookie(email: string, password: string) {
  const { req, res } = createMocks({
    method: "POST",
    body: {
      email,
      password,
    },
  });

  await login(req as any, res as any);
  const cookieHeader = res._getHeaders()["set-cookie"]!;
  return cookieHeader[0].split(";")[0];
}

beforeAll(async () => {
  await connectDB();
  await createUser(username, email, password);
});

afterAll(async () => {
  await disconnectDB();
});

describe("Tests to retrieve a user", () => {
  test("It should retrieve a user ", async () => {
    const cookie = await getCookie(email, password);
    const { req, res } = createMocks({
      headers: {
        Cookie: cookie,
      },
    });

    await getUser(req as any, res as any);
    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({ username, email });
  });
});
