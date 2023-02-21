/* eslint-disable @next/next/no-sync-scripts */
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@100;300;500;700&family=Poppins:wght@100;300;500;700&display=swap"
          rel="stylesheet"
        ></link>
        <script
          defer
          src="https://developers.kakao.com/sdk/js/kakao.js"
        ></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
