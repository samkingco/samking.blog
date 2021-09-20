import { useRouter } from "next/router";
import Head from "next/head";

interface Props {
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

export function DefaultHeadTags({
  title = "Words — Sam King",
  description = "Documenting some thoughts to help get me back into writing. Posts will be about anything. Mostly my journey with design, Web3, and therapy.",
  children,
}: Props) {
  const router = useRouter();
  const url = `https://samking.blog/${router.pathname}`;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={title} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@samkingco" />
      {children}
    </Head>
  );
}
