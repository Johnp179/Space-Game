import { connectDB, disconnectDB } from "@/database/dbConnect";
import HighScore from "@/database/models/HighScore";
import { generateRandomHighScores } from "@/lib/testFunctions";
import getAndAddHighScores, { maxScores } from "@/pages/api/high-scores";
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
    await getAndAddHighScores(req as any, res as any);
    expect(Array.isArray(res._getJSONData())).toBe(true);
  });
});

describe("Test for posting high scores", () => {
  const method = "POST";

  test("It should throw a 400 error", async () => {
    const { req, res } = createMocks({
      method,
      body: {
        name: "john",
      },
    });
    await getAndAddHighScores(req as any, res as any);
    expect(res._getStatusCode()).toBe(400);
  });

  test("It should add a new high score", async () => {
    const { req, res } = createMocks({
      method,
      body: {
        username: "john",
        score: 25,
      },
    });
    await getAndAddHighScores(req as any, res as any);
    expect(res._getJSONData()).toEqual({ added: true });
  });

  test("It should replace a high score", async () => {
    await HighScore.deleteMany({});
    const scores = generateRandomHighScores();
    await HighScore.insertMany(scores);

    scores.sort((a, b) => b.score - a.score);
    const lowestScore = scores[scores.length - 1];

    const { req, res } = createMocks({
      method,
      body: {
        username: "john",
        score: lowestScore.score + 1,
      },
    });
    await getAndAddHighScores(req as any, res as any);
    expect(res._getJSONData()).toEqual({ added: true });
  });

  test("It should fail to add a high score", async () => {
    await HighScore.deleteMany({});
    const scores = generateRandomHighScores();
    await HighScore.insertMany(scores);

    scores.sort((a, b) => b.score - a.score);
    const lowestScore = scores[scores.length - 1];

    const { req, res } = createMocks({
      method,
      body: {
        username: "john",
        score: lowestScore.score - 1,
      },
    });
    await getAndAddHighScores(req as any, res as any);
    expect(res._getJSONData()).toEqual({ added: false });
  });
});
