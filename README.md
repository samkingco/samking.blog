This is a small site that is built off markdown files. First some HTML files are generated using some templates in `src/build.ts`. Those files are then picked up by [Parcel](https://v2.parceljs.org/) to handle the final build including asset caching etc.

## Build it locally

```bash
pnpm run build
```

## Deployment

This site is deployed on [IPFS](https://ipfs.io/) via [Fleek](https://fleek.co/). Just push `main` and it will be automatically built and deployed.

## Spot a mistake?

Open a PR and I'll have a look :).
