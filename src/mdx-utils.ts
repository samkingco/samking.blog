import fs from "fs";
import path from "path";
import { MDXRemoteSerializeResult } from "next-mdx-remote";

export const POSTS_PATH = path.join(process.cwd(), "src/posts");

export const postFilePaths = fs
  .readdirSync(POSTS_PATH)
  .filter((path) => /\.mdx?$/.test(path));

export interface PostData {
  title: string;
  date: number;
  excerpt: string;
}

export interface Post {
  data: PostData;
  slug: string;
  content: MDXRemoteSerializeResult;
}
