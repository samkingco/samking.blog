import { replaceInFile } from "replace-in-file";

const baseURL = "https://samking.blog";

(async () => {
  const timer = "Fixed links in dist files";
  console.time(timer);
  // Replace image links in RSS feed for absolute urls
  await replaceInFile({
    files: "dist/**/rss.xml",
    from: /\/icon-round-144.png/g,
    to: `${baseURL}/icon-round-144.png`,
  });
  await replaceInFile({
    files: "dist/**/rss.xml",
    from: /src="\//g,
    to: `src="${baseURL}/`,
  });
  // Replace relative links for absolute links in RSS feed
  await replaceInFile({
    files: "dist/**/rss.xml",
    from: /href=".\//g,
    to: `href="${baseURL}/`,
  });
  // Replace "/${slug}/index.html" with "/${slug}/" for pretty urls
  await replaceInFile({
    files: "dist/**/*.html",
    from: /\/index.html/g,
    to: "/",
  });
  // Replace social image links for absolute urls
  await replaceInFile({
    files: "dist/**/*.html",
    from: /content="\/social\//g,
    to: `content="${baseURL}/social/`,
  });
  console.timeEnd(timer);
})().catch((err) => {
  console.error(err);
});
