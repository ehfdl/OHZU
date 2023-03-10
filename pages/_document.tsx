/* eslint-disable @next/next/no-sync-scripts */
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="robots" content="index,follow" />
        <meta property="og:site_name" content="OHZU" />
        <meta property="og:title" content="OHZU: 나만의 혼합주" />
        <meta property="og:url" content="https://ohzu.vercel.app/" />
        <meta
          property="og:description"
          content="OHZU는 나 혼자 알기 아쉬운 혼합주를 공유하고, 애주가들이 즐겨마시는 혼합주 레시피를 볼 수 있는 공간입니다. 취향에 맞는 다양하고 맛있는 술을 직접 만들어서 마시는 즐거움을 두 배로!"
        />
        <link
          rel="stylesheet"
          href="//cdn.jsdelivr.net/npm/font-applesdgothicneo@1.0/all.min.css"
        ></link>
        <link rel="icon" href="/favicon/favicon.svg" />
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
