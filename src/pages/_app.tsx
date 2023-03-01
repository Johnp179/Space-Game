import "@/styles/globals.css";
import { Roboto } from "@next/font/google";
import type { AppProps } from "next/app";
import Head from "next/head";

const roboto = Roboto({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Space Game</title>
        <meta name="description" content="Portfolio site for John O'Connor" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        className={`${roboto.variable} font-sans text-neutral-200 min-h-screen bg-slate-900 `}
      >
        <Component {...pageProps} />
      </div>
    </>
  );
}
