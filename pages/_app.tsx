import Loading from "@/components/loading/loading";
import { apiKey } from "@/firebase";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Router } from "next/router";
import { useEffect, useState } from "react";
import Lottie from "react-lottie-player";
import { RecoilRoot } from "recoil";
import lottieJson from "../animation/loading_spinner.json";

declare global {
  interface Window {
    Kakao: any;
    // naver: any;
  }
}

export default function App({ Component, pageProps }: AppProps) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const start = () => {
      // NProgress.start();
      setLoading(true);
    };
    const end = () => {
      // NProgress.done();
      setLoading(false);
    };

    Router.events.on("routeChangeStart", start);
    Router.events.on("routeChangeComplete", end);
    Router.events.on("routeChangeError", end);

    return () => {
      Router.events.off("routeChangeStart", start);
      Router.events.off("routeChangeComplete", end);
      Router.events.off("routeChangeError", end);
    };
  }, []);

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

  return loading ? (
    <Loading />
  ) : (
    <>
      <Head>
        {/* <meta name="viewport" content="width=device-width, initial-scale=1.0" /> */}
        {/* ⬇ 모바일 환경에서 input zoom-in 막기 */}
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
