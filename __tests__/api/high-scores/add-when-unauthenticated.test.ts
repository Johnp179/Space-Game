import { connectDB, disconnectDB } from "@/database/dbConnect";
import HighScore, { IHighScore } from "@/database/models/HighScore";
import User from "@/database/models/User";
import { generateRandomHighScores } from "@/lib/testFunctions";
import { maxScores } from "@/pages/api/high-scores";
import addHighScoreWhenUnAuthenticated from "@/pages/api/high-scores/add-when-unauthenticated";
import { createMocks } from "node-mocks-http";

// function getRandomNumber(min: number, max: number) {
//   return Math.floor(Math.random() * (max - min) + min);
// }

// function generateRandomHighScores() {
//   const scores: IHighScore[] = [];
//   const names = ["john", "Paul", "Mark", "Katie", "Cat"];

//   for (let i = 0; i < maxScores; i++) {
//     scores.push({
//       username: names[getRandomNumber(0, names.length)],
//       score: getRandomNumber(100, 500),
//     });
//   }

//   return scores;
// }

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await disconnectDB();
});

describe("Tests for adding a high score when unauthenticated", () => {
  const method = "POST";
  test("It should fail to add high score as user already exists ", async () => {
    const username = "Jimmy";
    await User.create({
      username,
      email: "jimmy@gmail.com ",
      password: "password",
    });

    const { req, res } = createMocks({
      method,
      body: {
        username,
      },
    });

    await addHighScoreWhenUnAuthenticated(req as any, res as any);
    expect(res._getJSONData()).toEqual({
      userExists: true,
    });
  });

  test("It should throw a 400 error", async () => {
    const { req, res } = createMocks({
      method,
      body: {
        name: "jim",
      },
    });
    await addHighScoreWhenUnAuthenticated(req as any, res as any);
    expect(res._getStatusCode()).toBe(400);
  });

  test("It should add a new high score", async () => {
    const { req, res } = createMocks({
      method,
      body: {
        username: "jim",
        score: 25,
      },
    });
    await addHighScoreWhenUnAuthenticated(req as any, res as any);
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
    await addHighScoreWhenUnAuthenticated(req as any, res as any);
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
    await addHighScoreWhenUnAuthenticated(req as any, res as any);
    expect(res._getJSONData()).toEqual({ added: false });
  });
});
