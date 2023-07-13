import "@/styles/globals.css";
import { Roboto } from "@next/font/google";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Triangle } from "react-loader-spinner";

const roboto = Roboto({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

function ErrorFallback({
  resetErrorBoundary,
}: {
  resetErrorBoundary: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col gap-3 justify-center items-center">
      <h1 className="text-3xl font-bold">
        Oh dear, it appears something bad has happened!
      </h1>
      <h3 className="text-xl">Click the button below to attempt to reload.</h3>
      <button
        className="border rounded-md p-2 uppercase hover:bg-neutral-200 hover:text-black"
        onClick={resetErrorBoundary}
      >
        Reload
      </button>
    </div>
  );
}

function Loading() {
  return (
    <main className="flex flex-col justify-center items-center min-h-screen">
      <Triangle
        height="300"
        width="300"
        color="#e2e8f0"
        ariaLabel="triangle-loading"
      />
    </main>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  });

  return (
    <>
      <Head>
        <title>Space Game</title>
        <meta name="description" content="Space Game" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        className={`${roboto.variable} font-sans text-neutral-200 bg-slate-800`}
      >
        {loading ? (
          <Loading />
        ) : (
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Component {...pageProps} />
          </ErrorBoundary>
        )}
      </div>
    </>
  );
}
