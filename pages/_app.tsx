import { apiKey } from "@/firebase";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useEffect } from "react";
import { RecoilRoot } from "recoil";

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
        {/* <meta name="viewport" content="width=device-width, initial-scale=1.0" /> */}
        {/* 모바일 환경에서 input zoom-in 막기 */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        />
        <title>OHZU</title>
      </Head>
      <RecoilRoot>
        <Component {...pageProps} />
      </RecoilRoot>
    </>
  );
}
