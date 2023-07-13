import { IHighScore } from "@/database/models/HighScore";
import { maxScores } from "@/pages/api/high-scores";
import User from "@/database/models/User";
import bcrypt from "bcrypt";

function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

export function generateRandomHighScores() {
  const scores: IHighScore[] = [];
  const names = ["john", "Paul", "Mark", "Katie", "Cat"];

  for (let i = 0; i < maxScores; i++) {
    scores.push({
      _id: i + "",
      username: names[getRandomNumber(0, names.length)],
      score: getRandomNumber(100, 500),
    });
  }

  return scores;
}

export async function createUser(
  username: string,
  email: string,
  password: string
) {
  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({
    username,
    email,
    password: hashedPassword,
  });
}
