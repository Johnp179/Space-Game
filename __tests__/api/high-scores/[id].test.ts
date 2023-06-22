import { connectDB, disconnectDB } from "@/database/dbConnect";
import HighScore from "@/database/models/HighScore";
import alterHighScores from "@/pages/api/high-scores/[id]";
import { createMocks } from "node-mocks-http";

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await disconnectDB();
});

describe("Tests for delete requests ", () => {
  const method = "DELETE";
  test("it should delete a high score", async () => {
    const highScore = new HighScore({
      username: "john",
      score: 20,
    });

    await highScore.save();

    const { req, res } = createMocks({
      method,
      query: {
        id: highScore._id.toString(),
      },
    });
    await alterHighScores(req as any, res as any);
    expect(res._getStatusCode()).toBe(200);
  });

  test("it should fail because the id does not exist", async () => {
    const { req, res } = createMocks({
      method,
      query: {
        id: "6463ec4a989a3468b5d8adc1",
      },
    });
    await alterHighScores(req as any, res as any);
    expect(res._getStatusCode()).toBe(400);
  });

  test("it should fail because of a cast error", async () => {
    const { req, res } = createMocks({
      method,
      query: {
        id: "6463ec4a989a3468b5d",
      },
    });
    await alterHighScores(req as any, res as any);
    expect(res._getStatusCode()).toBe(400);
  });
});

describe("Tests for update requests ", () => {
  const method = "PUT";
  test("it should update a high score", async () => {
    const highScore = new HighScore({
      username: "john",
      score: 20,
    });

    await highScore.save();

    const { req, res } = createMocks({
      method,
      query: {
        id: highScore._id.toString(),
      },
    });
    await alterHighScores(req as any, res as any);
    expect(res._getStatusCode()).toBe(200);
  });

  test("it should fail because the id does not exist", async () => {
    const { req, res } = createMocks({
      method,
      query: {
        id: "6463ec4a989a3468b5d8adc1",
      },
    });
    await alterHighScores(req as any, res as any);
    expect(res._getStatusCode()).toBe(400);
  });

  test("it should fail because of a cast error", async () => {
    const { req, res } = createMocks({
      method,
      query: {
        id: "6463ec4a989a3468b",
      },
    });
    await alterHighScores(req as any, res as any);
    expect(res._getStatusCode()).toBe(400);
  });
});
