import Nav from "@/components/Nav";
import { InferGetServerSidePropsType } from "next";
import HighScore from "@/database/models/HighScore";
import dBConnect from "@/database/dbConnect";

export interface IHighScore {
  _id: string;
  user: string;
  score: number;
}

function Row({
  ranking,
  user,
  score,
}: {
  ranking: number;
  user: string;
  score: number;
}) {
  return (
    <div className="flex text-center hover:bg-slate-100 hover:text-black">
      <div className="flex-1 text-2xl">{ranking}</div>
      <div className="flex-1 text-2xl">{user}</div>
      <div className="flex-1 text-2xl">{score}</div>
    </div>
  );
}

function HighScoreTable({ highScores }: { highScores: IHighScore[] }) {
  return (
    <div>
      <header className="flex w-[70vw] text-center rounded-t-md bg-slate-100 p-2 mb-1 text-black">
        <div className="flex-1 text-3xl">Ranking</div>
        <div className="flex-1 text-3xl">User</div>
        <div className="flex-1 text-3xl">Score</div>
      </header>
      <div className="space-y-2">
        {highScores.map(({ user, score }, index) => (
          <Row key={index} ranking={index + 1} user={user} score={score} />
        ))}
      </div>
    </div>
  );
}

export default function HighScores({
  highScores,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Nav />
      <main className="h-screen flex justify-center items-center ">
        <HighScoreTable highScores={highScores} />
      </main>
    </>
  );
}

export async function getServerSideProps() {
  dBConnect();
  const result = await HighScore.find({}, null, {
    sort: { score: -1 },
  });
  const highScores: IHighScore[] = result.map((doc) => {
    const highScore = doc.toObject();
    highScore._id = highScore._id.toString();
    return highScore;
  });

  return {
    props: {
      highScores,
    },
  };
}
