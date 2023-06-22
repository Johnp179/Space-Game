import { connectDB, disconnectDB } from "@/database/dbConnect";
import Comment from "@/database/models/Comment";
import getAndAddComments from "@/pages/api/comments";
import { createMocks } from "node-mocks-http";

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await disconnectDB();
});

describe("Test for getting high scores", () => {
  test("It should return an array of high scores", async () => {
    const { req, res } = createMocks();
    await getAndAddComments(req as any, res as any);
    expect(Array.isArray(res._getJSONData())).toBe(true);
  });
});

describe("Test for posting high scores", () => {
  const method = "POST";

  test("It should throw a 400 error", async () => {
    const { req, res } = createMocks({
      method,
      body: {
        author: "john",
      },
    });
    await getAndAddComments(req as any, res as any);
    expect(res._getStatusCode()).toBe(400);
  });

  test("It should add a new comment", async () => {
    const { req, res } = createMocks({
      method,
      body: {
        author: "john",
        content: "random content",
      },
    });
    await getAndAddComments(req as any, res as any);
    expect(res._getStatusCode()).toBe(201);
  });
});
