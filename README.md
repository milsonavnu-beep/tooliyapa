# Tooliyapa - Free Online PDF Tools

A fast, privacy-first web app for working with PDFs — built with Next.js, Tailwind CSS, and pdf-lib. **All processing happens in your browser** — files never leave your device.

## Features

- **Merge PDF** — Combine multiple PDFs in any order, drag-and-drop supported.
- **Compress PDF** — Reduce file size with selectable compression levels. See before/after sizes.
- 100% client-side. No uploads. No accounts. No tracking.
- Mobile-first responsive UI.
- SEO meta tags, favicon, and clean branding.

## Tech Stack

- [Next.js 14](https://nextjs.org/) (App Router)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/) components
- [pdf-lib](https://pdf-lib.js.org/) for client-side PDF manipulation
- [react-dropzone](https://react-dropzone.js.org/) for drag-and-drop uploads
- [lucide-react](https://lucide.dev/) icons

## Local Development

```bash
yarn install
yarn dev
```

Visit `http://localhost:3000`.

## Build for Production

```bash
yarn build
yarn start
```

## Deploy to Vercel

This project is fully Vercel-ready.

1. Push to GitHub.
2. Import the repo in [Vercel](https://vercel.com/new).
3. Use default Next.js settings — no extra config required.
4. Deploy.

## Environment Variables

None required for the core PDF tools (everything is client-side).

## License

MIT
