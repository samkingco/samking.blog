import { replaceInFile } from "replace-in-file";

// Replace "/${slug}/index.html" with "/${slug}/" for pretty urls
(async () => {
  const timer = "Fixed links in dist .html files";
  console.time(timer);
  await replaceInFile({
    files: "dist/**/*.html",
    from: /\/index.html/g,
    to: "/",
  });
  console.timeEnd(timer);
})().catch((err) => {
  console.error(err);
});
