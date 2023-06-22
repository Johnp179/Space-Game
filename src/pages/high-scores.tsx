import Nav from "@/components/Nav";
import { InferGetServerSidePropsType, GetServerSideProps } from "next";
import HighScore from "@/database/models/HighScore";
import { connectDB } from "@/database/dbConnect";
import { IHighScore } from "@/database/models/HighScore";

function Row({
  ranking,
  username,
  score,
}: {
  ranking: number;
  username: string;
  score: number;
}) {
  return (
    <div className="flex text-center hover:bg-slate-100 hover:text-black">
      <div className="flex-1 text-2xl">{ranking}</div>
      <div className="flex-1 text-2xl">{username}</div>
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
        {highScores.map(({ username, score }, index) => (
          <Row
            key={index}
            ranking={index + 1}
            username={username}
            score={score}
          />
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

export const getServerSideProps: GetServerSideProps<{
  highScores: IHighScore[];
}> = async () => {
  connectDB();
  const results = await HighScore.find({}, null, {
    sort: { score: -1 },
  });
  const highScores: IHighScore[] = results.map((doc) => ({
    ...doc.toObject(),
    _id: doc._id.toString(),
  }));

  // if (error) {
  //   return {
  //     redirect: {
  //       destination: '/',
  //       permanent: false,
  //     },
  //   };
  // }

  return {
    props: {
      highScores,
    },
  };
};
