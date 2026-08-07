# Adding a Tooliyapa utility tool

This guide matches the Task 2 platform architecture. Do **not** invent new routes outside the registry.

## Checklist

1. **Implement the tool UI** as a client component under `components/tooliyapa/` (for example `WordCounterTool.js`). Keep heavy libraries inside that component (or a dedicated `lib/` helper), never inside the registry.
2. **Register metadata** in `lib/tools/registry.js`:
   - unique `id`, `slug`, `href`
   - `category` that already exists and is `active` (or activate a planned category only when the first tool ships)
   - `tags`, `searchTerms`, `seo`, `howToUse`, `faq`, `relatedToolIds`, `processing`
   - `status: 'active'`
3. **Create a thin App Router page** at `app/<slug>/page.js`:

```js
import SomeTool from '@/components/tooliyapa/SomeTool'
import ToolPageLayout from '@/components/tooliyapa/ToolPageLayout'
import { buildToolMetadata } from '@/lib/tools/metadata'

export const metadata = buildToolMetadata('your-tool-id')

export default function Page() {
  return (
    <ToolPageLayout toolId="your-tool-id">
      <SomeTool />
    </ToolPageLayout>
  )
}
```

4. **Reuse ToolShell** inside the tool component for the H1 / icon / privacy badge chrome.
5. **Add or extend tests**:
   - registry integrity (unique ids/slugs) already covers new entries
   - search cases for important synonyms
   - tool-specific unit tests for pure logic
6. **Verify**:
   - `yarn test`
   - `yarn build`
   - homepage, `/pdf` (or the tool’s category page), search, related tools, sitemap, and metadata pick up the tool automatically
7. **Do not** add paid APIs, API keys, or server-side file upload pipelines unless product rules explicitly change.

## What the registry powers automatically

- Homepage tool cards
- Category pages (active categories only)
- Header / mobile navigation (via featured + nav fields)
- Client-side search
- Related tools
- Breadcrumbs / FAQ / How to use / limitations (via `ToolPageLayout`)
- Canonical + Open Graph URL metadata
- JSON-LD
- Sitemap entries

## URL policy

Prefer stable root-level slugs (for example `/merge-pdf`). Do not move existing public URLs.
