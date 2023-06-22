import { connectDB, disconnectDB } from "@/database/dbConnect";
import User from "@/database/models/User";
import getUsers from "@/pages/api/user/all";
import { createMocks } from "node-mocks-http";

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await disconnectDB();
});

describe("Test for getting all users", () => {
  test("it should retrieve all users", async () => {
    const { req, res } = createMocks();
    await getUsers(req as any, res as any);
    const result = res._getJSONData();
    expect(Array.isArray(result)).toBe(true);
  });
});
