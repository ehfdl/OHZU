import { apiKey } from "@/firebase";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useEffect } from "react";

declare global {
  interface Window {
    Kakao: any;
    // naver: any;
  }
}

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    try {
      if (!window.Kakao.isInitialized() && window.Kakao) {
        window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_KEY);
        // window.naver.init(process.env.NEXT_PUBLIC_NAVER_CLIENT_ID);
      }
    } catch (e) {
      console.log(e);
    }
  }, []);

  return (
    <>
      <Head>
        <title>OHZU</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
