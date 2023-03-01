import { useEffect, useState } from "react";
import Nav from "@/components/Nav";

export interface IHighScore {
  _id: string;
  user: string;
  score: number;
}

async function fetchData(url: string) {
  const resp = await fetch(url);
  const { data, error } = await resp.json();
  if (!resp.ok) throw error;
  return data;
}

function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<object | string | null>(null);

  useEffect(() => {
    let ignore = false;
    async function fetchData() {
      try {
        const resp = await fetch(url);
        const { data, error } = await resp.json();
        if (!resp.ok) throw error;
        if (!ignore) setData(data);
      } catch (error) {
        if (typeof error === "object" || typeof error === "string") {
          setError(error);
        }
      }
    }
    fetchData();

    return () => {
      ignore = true;
    };
  }, [url]);

  return {
    data,
    error,
  };
}

export default function Home() {
  const { data, error } = useFetch<IHighScore[]>(
    "http://localhost:3000/api/high-scores"
  );

  const loadingMsg = <h1>Loading...</h1>;
  const errorMsg = (
    <h1>Something bad happened on the network, check logs for more info!</h1>
  );
  const body = (
    <>
      <h1 className="text-3xl">index page</h1>
      {
        <ul className="border space-y-2 p-5">
          {data?.map((score) => (
            <li key={score._id}>{score.score}</li>
          ))}
        </ul>
      }
    </>
  );

  return (
    <>
      <Nav />
      <main className="flex flex-col justify-center items-center min-h-screen">
        {error ? errorMsg : !data ? loadingMsg : body}
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
