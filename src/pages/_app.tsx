import "@/styles/globals.css";
import { Roboto } from "@next/font/google";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Component } from "react";

const roboto = Roboto({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

export class ErrorBoundary extends Component<any> {
  state: { hasError: boolean };
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: any, info: any) {
    // Example "componentStack":
    //   in ComponentThatThrows (created by App)
    //   in ErrorBoundary (created by App)
    //   in div (created by App)
    //   in App
    // console.error(error, info.componentStack);
    console.error(info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback;
    }

    return this.props.children;
  }
}

// <ErrorBoundary fallback={<h1>This is the error message</h1>}>
// <Component {...pageProps} />
// </ErrorBoundary>

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
        <ErrorBoundary fallback={<h1>This is the error message</h1>}>
          <Component {...pageProps} />
        </ErrorBoundary>
      </div>
    </>
  );
}
