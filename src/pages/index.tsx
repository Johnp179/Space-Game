import { useState, Component, useEffect, useRef } from "react";
import Nav from "@/components/Nav";
import { sessionOptions } from "@/lib/session";
import { withIronSessionSsr } from "iron-session/next";
import { InferGetServerSidePropsType } from "next";
import dynamic from "next/dynamic";
import { CirclesWithBar } from "react-loader-spinner";

const Game = dynamic(() => import("@/components/Game"), {
  ssr: false,
  loading: () => {
    return (
      <CirclesWithBar
        height="150"
        width="150"
        color="#e2e8f0"
        wrapperStyle={{}}
        wrapperClass="z-10"
        outerCircleColor=""
        innerCircleColor=""
        barColor=""
        ariaLabel="circles-with-bar-loading"
      />
    );
  },
});

export default function Home({
  user: userProp,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [user, setUser] = useState(userProp);

  return (
    <>
      <Nav user={user} setUser={setUser} />
      <main className="flex flex-col justify-center items-center min-h-screen">
        <Game user={user} />
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
