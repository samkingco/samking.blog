import type { AppProps } from "next/app";
import "../styles.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className="content">
      <Component {...pageProps} />
    </main>
  );
}
