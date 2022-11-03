import { format } from "date-fns";
import fs from "fs";
import fse from "fs-extra";
import matter from "gray-matter";
import { marked } from "marked";
import path from "path";
import prism from "prismjs";
import loadLanguages from "prismjs/components/";

loadLanguages(["markdown", "solidity", "tsx", "typescript", "json"]);

function parseRange(range: string) {
  const res: number[] = [];
  for (let el of range.split(",").map((str) => str.trim())) {
    const [left, right] = el.split("-");
    const leftInt = parseInt(left, 10);
    res.push(leftInt);
    if (right) {
      const rightInt = parseInt(right, 10);
      for (let i = leftInt + 1; i <= rightInt; i++) {
        res.push(i);
      }
    }
  }
  return res;
}

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
  const baseURL = "https://samking.blog";
  const url = `${baseURL}/${slug ? `${slug}/` : ""}`;
  const socialImage = `${slug ? "../" : "./"}social/og-image${
    slug ? `-${slug}` : ""
  }.png`;

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
  <link rel="alternate" type="application/rss+xml" title="Words RSS — Sam King" href="${baseURL}/rss.xml" />
  <meta name="description" content="${description}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${socialImage}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:site_name" content="${title}" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${socialImage}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@samkingco" />
  <script defer data-domain="samking.blog" src="https://plausible.io/js/plausible.js"></script>
</head>`;
}

function generateSiteHeader() {
  return `
<header class="site-header">
  <div class="site-header-links">
    <p class="site-logo">
      <a href="/">—words</a>
    </p>
    <a href="https://samking.co">samking.co</a>
  </div>
</header>`;
}

function generatePostPreviews(posts: Post[]) {
  return posts
    .map((post) => {
      return `
<article class="post-preview">
  <p class="subtle">
    <small>
      ${format(new Date(post.data.date), "do MMMM, yyyy")}
    </small>
  </p>
  <h2>
    <a href="./${post.slug}/index.html">${post.data.title}</a>
  </h2>
  <p>${post.data.excerpt}</p>
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
          Code on <a href="https://github.com/samkingco/samking.blog">Github</a> deployed to <a href="https://ipfs.io/">IPFS</a>.
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
      title: `${data.title} — Sam King`,
      description: data.excerpt,
      slug,
    })}
    <body>
      <main class="content">
        ${generateSiteHeader()}
        <article class="post">
          <header class="post-header">
            <p class="subtle">
              <small>
                ${format(new Date(data.date), "do MMMM, yyyy")}
              </small>
            </p>
            <h1>${data.title}</h1>
          </header>
          ${html}
          <footer class="post-footer">
            <a href="/" class="all-posts-link">← All posts</a>
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

function formatRSSDate(date: string | number | Date) {
  return format(new Date(date), "iii, dd MMM yyyy HH:mm:ss 'GMT'");
}

function generateRSSFeed(posts: Post[]) {
  const title = "Words — Sam King";
  const description =
    "Documenting some thoughts to help get me back into writing. Posts will be about anything. Mostly my journey with design, Web3, and therapy.";
  const link = "https://samking.blog";
  const contact = "sam@samking.studio (Sam King)";

  return `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${title}</title>
    <link>${link}</link>
    <atom:link href="${link}/rss.xml" rel="self" type="application/rss+xml" />
    <description>${description}</description>
    <copyright>Copyright ${new Date().getFullYear()}, Sam King</copyright>
    <managingEditor>${contact}</managingEditor>
    <webMaster>${contact}</webMaster>
    <language>en-gb</language>
    <pubDate>${formatRSSDate(posts[posts.length - 1].data.date)}</pubDate>
    <lastBuildDate>${formatRSSDate(new Date())}</lastBuildDate>
    <generator>https://github.com/samkingco/samking.blog</generator>
${posts
  .map(
    (post) => `    <item>
      <title>${post.data.title}</title>
      <link>https://samking.blog/${post.slug}</link>
      <guid>https://samking.blog/${post.slug}</guid>
      <description>${post.data.excerpt}</description>
      <pubDate>${formatRSSDate(post.data.date)}</pubDate>
      <author>${contact}</author>
      <source url="https://samking.blog">samking.blog</source>
    </item>`
  )
  .join("\n")}
  </channel>
</rss>`;
}

async function build() {
  const posts: Post[] = await Promise.all(
    postFilePaths.map(async (filePath) => {
      const source = fs.readFileSync(path.join(POSTS_PATH, filePath));
      const { data, content } = matter(source);

      marked.setOptions({
        highlight: function (code, language) {
          const lang = language.replace(/\{([^\}]*)\}/g, "");
          const highlightQuery = language.match(/\{([^\}]*)\}/g);
          const highlightLines: number[] = [];
          if (highlightQuery) {
            const lines = highlightQuery[0].replace("{", "").replace("}", "");
            highlightLines.push(...parseRange(lines));
          }

          if (prism.languages[lang]) {
            const highlighted = prism.highlight(
              code,
              prism.languages[lang],
              lang
            );

            const lines = highlighted.split("\n");

            return lines
              .map((line, index) => {
                return `<span${
                  highlightLines.includes(index + 1) ? ' class="highlight"' : ""
                }>${line || "\n"}</span>`;
              })
              .join("");
          } else {
            return code;
          }
        },
      });

      return {
        data: data as PostData,
        slug: filePath.replace(/\.md?$/, ""),
        content,
        html: marked.parse(content),
      };
    })
  );

  const sortedPosts = posts.sort((a, b) =>
    a.data.date > b.data.date ? -1 : 1
  );

  // Build index page
  await fse.outputFile(
    path.join(process.cwd(), "entry/index.html"),
    generateIndexPage(sortedPosts)
  );

  // Build post pages
  await Promise.all(
    sortedPosts.map(async (post) => {
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

  // Build the RSS feed
  await fse.outputFile(
    path.join(process.cwd(), "dist/rss.xml"),
    generateRSSFeed(sortedPosts)
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
