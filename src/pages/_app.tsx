import "@/styles/globals.css";
import { Roboto } from "@next/font/google";
import type { AppProps } from "next/app";
import Head from "next/head";
import { ErrorBoundary } from "react-error-boundary";

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

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Space Game</title>
        <meta name="description" content="Space Game" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        className={`${roboto.variable} font-sans text-neutral-200 bg-slate-800 relative`}
      >
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Component {...pageProps} />
        </ErrorBoundary>
      </div>
    </>
  );
}
