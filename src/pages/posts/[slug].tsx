import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { format } from "date-fns";
import { ParsedUrlQuery } from "querystring";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import Link from "next/link";
import { serialize } from "next-mdx-remote/serialize";
import { Post, PostData, postFilePaths, POSTS_PATH } from "../../mdx-utils";
import { PostContent } from "../../components/PostContent";
import { SiteHeader } from "../../components/SiteHeader";
import { DefaultHeadTags } from "../../components/DefaultHeadTags";

export default function PostPage({
  data,
  content,
  slug,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <DefaultHeadTags
        title={`${data.title} — Words`}
        description={data.excerpt}
      />
      <SiteHeader />
      <article className="post">
        <header className="post-header">
          <p className="subtle">
            {format(new Date(data.date), "do MMMM, yyyy")}
          </p>
          <h1>{data.title}</h1>
        </header>
        <PostContent content={content} />
        <footer className="post-footer">
          <Link href="/">
            <a>All posts</a>
          </Link>

          <p className="subtle">
            Found a mistake? Edit on{" "}
            <a
              href={`https://github.com/samkingco/words.samking/blob/main/posts/${slug}.mdx`}
            >
              GitHub
            </a>
          </p>
        </footer>
      </article>
    </>
  );
}

interface Params extends ParsedUrlQuery {
  slug: string;
}

export const getStaticProps: GetStaticProps<Post> = async (context) => {
  const { slug } = context.params as Params;
  const postFilePath = path.join(POSTS_PATH, `${slug}.mdx`);
  const source = fs.readFileSync(postFilePath);
  const { content, data } = matter(source);
  const mdxSource = await serialize(content, { scope: data });

  return {
    props: {
      data: data as PostData,
      content: mdxSource,
      slug,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = postFilePaths
    .map((path: string) => path.replace(/\.mdx?$/, ""))
    .map((slug: string) => ({ params: { slug } }));

  return {
    paths,
    fallback: false,
  };
};
