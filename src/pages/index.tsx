import { useEffect, useState } from "react";

interface IHighScore {
  _id: string;
  user: string;
  score: number;
}

function useFetch(url: string) {
  const [data, setData] = useState<IHighScore[] | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let ignore = false;
    fetch(url)
      .then((resp) => resp.json())
      .then(({ highScores }) => {
        if (!ignore) setData(highScores);
      })
      .catch((e) => setError(e));

    return () => {
      ignore = true;
    };
  }, []);

  return {
    data,
    error,
  };
}

const loading = <h1>Loading...</h1>;

export default function Home() {
  const { data, error } = useFetch("http://localhost:3000/api/high-scores");

  return (
    <>
      <main className="flex flex-col justify-center items-center min-h-screen">
        <h1 className="text-3xl">index page</h1>
        <ul className="border space-y-2 p-5">
          {data
            ? data.map((score) => <li key={score._id}>{score.score}</li>)
            : loading}
        </ul>
      </main>
    </>
  );
}

export async function getStaticProps() {
  // do something with this later
  return {
    props: {},
  };
}
