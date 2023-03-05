import { apiKey } from "@/firebase";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useEffect, useState } from "react";
import { RecoilRoot } from "recoil";
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

declare global {
  interface Window {
    Kakao: any;
    // naver: any;
  }
}

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());
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
        <QueryClientProvider client={queryClient}>
          <Hydrate state={pageProps.dehydratedState}>
            <Component {...pageProps} />
          </Hydrate>
          {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        </QueryClientProvider>
      </RecoilRoot>
    </>
  );
}
