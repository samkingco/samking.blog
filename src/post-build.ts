import { replaceInFile } from "replace-in-file";

// Replace "/${slug}/index.html" with "/${slug}/" for pretty urls
(async () => {
  const timer = "Fixed links in dist .html files";
  console.time(timer);
  await replaceInFile({
    files: "dist/**/rss.xml",
    from: /\/icon-round-144.png/g,
    to: "https://samking.blog/icon-round-144.png",
  });
  await replaceInFile({
    files: "dist/**/*.html",
    from: /\/index.html/g,
    to: "/",
  });
  await replaceInFile({
    files: "dist/**/*.html",
    from: /content="\/social\//g,
    to: 'content="https://samking.blog/social/',
  });
  console.timeEnd(timer);
})().catch((err) => {
  console.error(err);
});
