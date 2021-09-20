import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { format } from "date-fns";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import Link from "next/link";
import { Post, PostData, postFilePaths, POSTS_PATH } from "../mdx-utils";
import { SiteHeader } from "../components/SiteHeader";
import { DefaultHeadTags } from "../components/DefaultHeadTags";

export default function Index({
  posts,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <DefaultHeadTags />
      <SiteHeader />
      {posts.map((post) => (
        <article key={post.slug} className="post-preview">
          <p className="subtle">
            {format(new Date(post.data.date), "do MMMM, yyyy")}
          </p>
          <h2>
            <Link as={`/${post.slug}`} href={`/[slug]`}>
              <a>{post.data.title}</a>
            </Link>
          </h2>
          <p>{post.data.excerpt}</p>
          <p>
            <Link as={`/${post.slug}`} href={`/[slug]`}>
              <a aria-label={`Continue reading ${post.data.title}`}>
                Continue reading
              </a>
            </Link>
          </p>
        </article>
      ))}
      <footer>
        <p className="subtle">
          Code on <a href="https://github.com/samkingco/samking.blog">Github</a>{" "}
          deployed to <a href="https://ipfs.io/">IPFS</a>.
        </p>
      </footer>
    </>
  );
}

type PostPreview = Omit<Post, "content">;

export const getStaticProps: GetStaticProps<{
  posts: PostPreview[];
}> = async () => {
  const posts: PostPreview[] = await Promise.all(
    postFilePaths.map(async (filePath) => {
      const source = fs.readFileSync(path.join(POSTS_PATH, filePath));
      const { data } = matter(source);

      return {
        data: data as PostData,
        slug: filePath.replace(/\.mdx?$/, ""),
      };
    })
  );

  return {
    props: {
      posts: posts.sort((a, b) => (a.data.date > b.data.date ? -1 : 1)),
    },
  };
};
