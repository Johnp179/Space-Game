import { connectDB, disconnectDB } from "@/database/dbConnect";
import HighScore from "@/database/models/HighScore";
import { generateRandomHighScores } from "@/lib/testFunctions";
import checkIfValidHighScore from "@/pages/api/high-scores/check-if-valid";
import { createMocks } from "node-mocks-http";

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await disconnectDB();
});

describe("Tests for checking if score is a high score  ", () => {
  const method = "POST";

  test("It should be a valid high score ", async () => {
    // case when number of scores is less than max-scores
    await HighScore.deleteMany({});
    const { req, res } = createMocks({
      method,
      body: {
        username: "john",
        score: 20,
      },
    });

    await checkIfValidHighScore(req as any, res as any);
    expect(res._getJSONData()).toEqual({ highScore: true });
  });

  test("It should be a valid high score ", async () => {
    // case when number of scores is equal to max-scores
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
    await checkIfValidHighScore(req as any, res as any);
    expect(res._getJSONData()).toEqual({ highScore: true });
  });

  test("It should not be valid high score ", async () => {
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
    await checkIfValidHighScore(req as any, res as any);
    expect(res._getJSONData()).toEqual({ highScore: false });
  });
});
