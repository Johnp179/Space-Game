import { useState, Component, useEffect, ReactNode } from "react";
import Nav from "@/components/Nav";
import { sessionOptions } from "@/lib/session";
import { withIronSessionSsr } from "iron-session/next";
import { InferGetServerSidePropsType } from "next";
import user from "./api/user";

// async function fetchData(url: string) {
//   const resp = await fetch(url);
//   const { data, error } = await resp.json();
//   if (!resp.ok) throw error;
//   return data;
// }

export default function Home({
  user: userProp,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [user, setUser] = useState(userProp);
  return (
    <>
      <Nav user={user} setUser={setUser} />
      <main className="flex flex-col justify-center items-center min-h-screen">
        <h1>welcome to the app {user && user.username} </h1>
        <button onClick={() => console.error("welcome to the game")}>
          click me
        </button>
      </main>
    </>
  );
}

export const getServerSideProps = withIronSessionSsr(({ req }) => {
  const { user } = req.session;

  return {
    props: { user: user ?? null },
  };
}, sessionOptions);
