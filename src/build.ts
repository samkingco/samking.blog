import fs from "fs";
import fse from "fs-extra";
import path from "path";
import matter from "gray-matter";
import marked from "marked";
import { format } from "date-fns";

const POSTS_PATH = path.join(process.cwd(), "src/posts");

const postFilePaths = fs
  .readdirSync(POSTS_PATH)
  .filter((path) => /\.mdx?$/.test(path));

interface PostData {
  title: string;
  date: string;
  excerpt: string;
}

interface Post {
  data: PostData;
  slug: string;
  content: string;
  html: string;
}

interface HeadProps {
  title: string;
  description: string;
  slug?: string;
}

function generateHead({ title, description, slug }: HeadProps) {
  const url = `https://samking.blog/${slug ? `${slug}/` : ""}`;
  return `
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <link rel="stylesheet" href="${slug ? "../" : "./"}styles.css" />
  <link rel="icon" type="image/x-icon" href="${
    slug ? "../" : "./"
  }favicon.ico"  />
  <meta name="description" content="${description}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:site_name" content="${title}" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:site" content="@samkingco" />
</head>`;
}

function generateSiteHeader() {
  return `
<header class="site-header">
  <div class="site-header-links">
    <p class="site-logo">
      <a href="/">words</a>
    </p>
    <a href="https://samking.co">samking.co</a>
  </div>
  <p class="subtle">
    Documenting some thoughts to help get me back into writing. Posts will
    be about anything. Mostly my journey with design, Web3, and therapy.
  </p>
</header>`;
}

function generatePostPreviews(posts: Post[]) {
  return posts
    .map((post) => {
      return `
<article class="post-preview">
  <p class="subtle">
    ${format(new Date(post.data.date), "do MMMM, yyyy")}
  </p>
  <h2>
    <a href="./${post.slug}/index.html">${post.data.title}</a>
  </h2>
  <p>${post.data.excerpt}</p>
  <p>
    <a href="./${post.slug}/index.html" aria-label="Continue reading '${
        post.data.title
      }'">
      Continue reading
    </a>
  </p>
</article>`;
    })
    .join("\n");
}

function generateIndexPage(posts: Post[]) {
  return `
<!DOCTYPE html>
<html lang="en">
  ${generateHead({
    title: "Words — Sam King",
    description:
      "Documenting some thoughts to help get me back into writing. Posts will be about anything. Mostly my journey with design, Web3, and therapy.",
  })}
  <body>
    <main class="content">
      ${generateSiteHeader()}
      ${generatePostPreviews(posts)}
      <footer>
        <p class="subtle">
          Code on
          <a href="https://github.com/samkingco/samking.blog">Github</a>{" "}
          deployed to <a href="https://ipfs.io/">IPFS</a>.
        </p>
      </footer>
    </main>
  </body>
</html>`;
}

function generatePostPage({ data, html, slug }: Post) {
  return `
  <!DOCTYPE html>
  <html lang="en">
    ${generateHead({
      title: "Words — Sam King",
      description:
        "Documenting some thoughts to help get me back into writing. Posts will be about anything. Mostly my journey with design, Web3, and therapy.",
      slug,
    })}
    <body>
      <main class="content">
        ${generateSiteHeader()}
        <article class="post">
          <header class="post-header">
            <p class="subtle">
              ${format(new Date(data.date), "do MMMM, yyyy")}
            </p>
            <h1>${data.title}</h1>
          </header>
          ${html}
          <footer class="post-footer">
            <a href="/">All posts</a>
            <p class="subtle">
              Found a mistake? Edit on 
              <a
                href="https://github.com/samkingco/samking.blog/blob/main/src/posts/${slug}.md"
              >
                GitHub
              </a>
            </p>
          </footer>
        </article>
      </main>
    </body>
  </html>`;
}

async function build() {
  const posts: Post[] = await Promise.all(
    postFilePaths.map(async (filePath) => {
      const source = fs.readFileSync(path.join(POSTS_PATH, filePath));
      const { data, content } = matter(source);

      return {
        data: data as PostData,
        slug: filePath.replace(/\.md?$/, ""),
        content,
        html: marked(content),
      };
    })
  );

  // Build index page
  await fse.outputFile(
    path.join(process.cwd(), "entry/index.html"),
    generateIndexPage(posts)
  );

  // Build post pages
  await Promise.all(
    posts.map(async (post) => {
      await fse.outputFile(
        path.join(process.cwd(), `entry/${post.slug}/index.html`),
        generatePostPage(post)
      );
    })
  );

  // Copy public folder files for parcel
  await fse.copy(
    path.join(process.cwd(), "src/public"),
    path.join(process.cwd(), "entry")
  );
}

(async () => {
  const timer = "Pre-build content done";
  console.time(timer);
  await build();
  console.timeEnd(timer);
})().catch((err) => {
  console.error(err);
});
