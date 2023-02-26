/* eslint-disable @next/next/no-sync-scripts */
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>OHZU</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@100;300;500;700&family=Poppins:wght@100;300;500;700&display=swap"
          rel="stylesheet"
        ></link>
        <link rel="icon" href="/favicon/favicon.svg"></link>
        <script
          defer
          src="https://developers.kakao.com/sdk/js/kakao.js"
        ></script>
        <script src="https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.2.js"></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
