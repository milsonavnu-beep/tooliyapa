# Tooliyapa — Free Online PDF Tools

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_GITHUB_USERNAME/tooliyapa)

> **Tooliyapa** is a fast, privacy-first web app with 10+ PDF tools — merge, split, compress, rotate, organize, watermark and convert PDFs entirely in your browser. **Files never leave your device.**

![Tooliyapa Hero](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js) ![Tailwind](https://img.shields.io/badge/Tailwind-3-38bdf8?style=flat-square&logo=tailwindcss) ![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## ✨ Features

| Tool | Description |
|---|---|
| 🔗 **Merge PDF** | Combine multiple PDFs in any order (drag-to-reorder) |
| ✂️ **Split PDF** | Click thumbnails to extract pages, or split every page |
| 📦 **Compress PDF** | 3 quality levels with before/after size comparison |
| 🔄 **Rotate PDF** | Rotate all or selected pages by 90/180/270° |
| 🗂️ **Organize PDF** | Drag-and-drop page thumbnails to reorder, rotate or delete |
| 🖼️ **JPG → PDF** | Convert JPG/PNG images to a single PDF |
| 📷 **PDF → JPG** | Render every page as a high-quality JPG image |
| #️⃣ **Page Numbers** | Add numbers in any position with multiple formats |
| 📝 **Watermark** | Add text watermark with opacity/rotation/size controls |
| 🔓 **Unlock PDF** | Remove owner-password restrictions |

### Other Highlights
- 🌙 **Dark mode** with system preference detection + localStorage persistence
- 📱 **Mobile-first** responsive design with hamburger menu
- 🚀 **PWA-ready** — installable as a standalone app (manifest.json)
- 🔍 **SEO-optimized** — separate URL per tool, sitemap.xml, robots.txt
- ⚡ **Fast** — ~316 KB first-load JS, all routes pre-rendered
- 🔒 **Privacy-first** — 100% client-side, no uploads, no tracking, no accounts

## 🛠 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, React Server Components)
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **PDF engine**: [pdf-lib](https://pdf-lib.js.org/) (manipulation) + [pdfjs-dist](https://mozilla.github.io/pdf.js/) (thumbnails/rendering)
- **Drag & drop**: [@dnd-kit](https://dndkit.com/) + [react-dropzone](https://react-dropzone.js.org/)
- **Theming**: [next-themes](https://github.com/pacocoursey/next-themes)
- **Icons**: [lucide-react](https://lucide.dev/)
- **Notifications**: [sonner](https://sonner.emilkowal.ski/)

## 🚀 Deploy to Vercel (1-click)

1. Push this repo to your GitHub account.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. **No environment variables needed** — just click **Deploy**.
4. Done! Your site is live.

Vercel auto-detects Next.js. No additional config required (`vercel.json` is included for clarity but optional).

## 💻 Local Development

### Prerequisites
- Node.js 18.17+ (or 20+)
- [Yarn 1.22](https://classic.yarnpkg.com/) (project uses yarn)

### Setup
```bash
# Clone
git clone https://github.com/YOUR_GITHUB_USERNAME/tooliyapa.git
cd tooliyapa

# Install dependencies
yarn install

# Run dev server
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Build for production
```bash
yarn build
yarn start
```

## ⚙️ Environment Variables

The app is **fully client-side** and needs **no environment variables** for core PDF features. The included `.env.example` lists optional values used only by the template scaffolding (MongoDB, etc.) which you can ignore or remove.

```bash
cp .env.example .env.local   # optional
```

## 📁 Project Structure

```
tooliyapa/
├── app/
│   ├── page.js                  # Homepage
│   ├── layout.js                # Root layout (theme provider, metadata)
│   ├── globals.css              # Global styles
│   ├── sitemap.js               # Auto-generated sitemap.xml
│   ├── merge-pdf/page.js        # Each tool has its own route
│   ├── split-pdf/page.js
│   ├── compress-pdf/page.js
│   ├── ... (10 tools total)
│   └── api/[[...path]]/route.js # Trivial status endpoint
├── components/
│   ├── tooliyapa/
│   │   ├── Header.js            # Navigation + theme toggle + mobile menu
│   │   ├── Footer.js
│   │   ├── HomePage.js          # Tool grid
│   │   ├── ToolShell.js         # Shared tool page wrapper
│   │   ├── MergePdfTool.js      # One file per tool
│   │   └── ... (10 tools)
│   └── ui/                      # shadcn/ui components
├── lib/
│   └── pdf-utils.js             # downloadBlob, formatBytes, parsePageRanges
├── public/
│   ├── favicon.svg              # Branded SVG favicon
│   ├── manifest.json            # PWA manifest
│   └── robots.txt
├── .gitignore
├── .env.example
├── LICENSE
├── next.config.js
├── package.json
├── tailwind.config.js
└── vercel.json
```

## 🚫 Tools NOT included (require server-side)

These iLovePDF features require a backend (e.g., LibreOffice headless, Tesseract OCR, qpdf):
- Word/Excel/PowerPoint ↔ PDF conversions
- HTML to PDF
- OCR PDF
- Strong user-password decryption
- Add password (encryption)

If you need these, integrate a service like [CloudConvert API](https://cloudconvert.com/api/v2) or self-host LibreOffice.

## 📝 License

MIT © Tooliyapa — see [LICENSE](LICENSE).

## 🙏 Credits

Built with love using open-source libraries. Inspired by [iLovePDF](https://www.ilovepdf.com/) but with a stronger privacy commitment — your files genuinely never leave your device.
