import { createPageMetadata } from './site.js'

export const TEXT_TOOLS = [
  {
    id: 'word-counter', title: 'Word & Character Counter', href: '/text/word-character-counter', subcategory: 'Count & analyze',
    description: 'Count words, characters, sentences, paragraphs, lines, and estimated reading or speaking time as you type.',
    keywords: 'word character counter sentence paragraph line reading speaking count text',
    about: 'This browser-based counter measures common text-length metrics from the text you provide. It treats Unicode letters and numbers as words where practical and updates the counts locally without sending your draft to a Tooliyapa text-processing backend.',
    limitations: 'Word and sentence boundaries vary by language and writing style, so automated counts can differ from a specific editor, publisher, social platform, or academic rule set.'
  },
  {
    id: 'case-converter', title: 'Case Converter', href: '/text/case-converter', subcategory: 'Transform & clean',
    description: 'Convert text between uppercase, lowercase, title case, sentence case, and toggle case.',
    keywords: 'uppercase lowercase title sentence toggle case converter text capitalization',
    about: 'Use Case Converter to quickly standardize capitalization for headings, labels, drafts, lists, and copied text. The conversion happens locally and preserves numbers, punctuation, and other non-letter characters.',
    limitations: 'Title case and sentence case use predictable browser rules rather than a language-aware editorial style guide. Proper nouns, acronyms, and specialized capitalization may need manual review.'
  },
  {
    id: 'text-diff', title: 'Text Diff Checker', href: '/text/text-diff', subcategory: 'Compare & review',
    description: 'Compare two blocks of text line by line and highlight unchanged, added, and removed lines.',
    keywords: 'text diff compare differences added removed lines changes checker',
    about: 'Text Diff Checker uses a bounded line-based longest-common-subsequence comparison to show how two versions differ. It is useful for reviewing notes, configuration snippets, copy edits, and other moderate-size text without uploading either version.',
    limitations: 'The comparison is line based, not a semantic or word-level review. To protect browser memory, each side is limited to a bounded number of lines and very large documents should use a dedicated version-control tool.'
  },
  {
    id: 'readability', title: 'Readability Analyzer', href: '/text/readability-analyzer', subcategory: 'Count & analyze',
    description: 'Estimate English readability with Flesch Reading Ease, Flesch-Kincaid grade level, and sentence-length metrics.',
    keywords: 'readability analyzer flesch reading ease kincaid grade sentence length english',
    about: 'The analyzer estimates how difficult predominantly English prose may be to read using established Flesch-style formulas and a browser-side syllable heuristic. It also reports sentence and word metrics that help explain the score.',
    limitations: 'Readability formulas are rough indicators, not judgments of writing quality or suitability for a particular audience. Syllable counting is heuristic and the scores should not be used for non-English text.'
  },
  {
    id: 'text-analyzer', title: 'Text Analyzer', href: '/text/text-analyzer', subcategory: 'Count & analyze',
    description: 'Analyze vocabulary, unique words, lexical diversity, average lengths, frequent words, and longest words.',
    keywords: 'text analyzer vocabulary unique words lexical diversity frequency longest average',
    about: 'Text Analyzer combines length and vocabulary metrics in one local report. It can help writers inspect repetition, sentence length, frequently used terms, vocabulary variety, and unusually long words before revising a draft.',
    limitations: 'Frequency and lexical-diversity metrics are descriptive only. Common stop words are excluded from the top-word list, and tokenization may not match specialized linguistic tools for every language.'
  },
  {
    id: 'find-replace', title: 'Find & Replace', href: '/text/find-replace', subcategory: 'Transform & clean',
    description: 'Find literal text and replace every match with optional case-sensitive and whole-word matching.',
    keywords: 'find replace text search replace all case sensitive whole word',
    about: 'Find & Replace performs literal text substitution directly in the browser. It is useful for repeated names, labels, codes, spelling changes, or cleanup tasks where the same text needs to be replaced throughout a draft.',
    limitations: 'This tool performs literal matching rather than regular-expression search. Whole-word matching follows JavaScript word-boundary behavior, which is most predictable for Latin letters, digits, and underscores.'
  },
  {
    id: 'sort-lines', title: 'Sort Lines / List', href: '/text/sort-lines', subcategory: 'Transform & clean',
    description: 'Sort lines ascending or descending with numeric, case-sensitive, trim, unique, and empty-line options.',
    keywords: 'sort lines list alphabetical numeric unique deduplicate trim order',
    about: 'Sort Lines turns newline-separated text into an ordered list using browser locale comparison or numeric sorting. Optional cleanup can trim whitespace, remove empty lines, and keep only the first occurrence of duplicate lines.',
    limitations: 'Locale sorting can differ between browsers or languages, and numeric mode falls back to text comparison for lines that are not finite numbers. Removing duplicates may intentionally discard repeated content.'
  },
  {
    id: 'split-text', title: 'Split Text', href: '/text/split-text', subcategory: 'Transform & clean',
    description: 'Split text by a delimiter or break it into line, word, or character chunks with bounded output.',
    keywords: 'split text delimiter chunks words characters lines parser separator',
    about: 'Split Text divides a text block into manageable parts without sending it to a server. You can split on a literal delimiter, separate lines, or make fixed-size word and character chunks for copying, batching, or inspection.',
    limitations: 'Delimiter splitting is literal and does not interpret regular expressions. The number of generated parts is capped to protect the browser, and word chunks normalize whitespace between included words.'
  },
  {
    id: 'reverse-text', title: 'Reverse Text', href: '/text/reverse-text', subcategory: 'Transform & clean',
    description: 'Reverse text by Unicode code point, word order, or line order.',
    keywords: 'reverse text characters words lines backwards flip order',
    about: 'Reverse Text offers three deliberately simple transformations: reverse character order, reverse word order, or reverse line order. Character mode uses Unicode code points rather than splitting raw UTF-16 code units.',
    limitations: 'Some displayed characters are composed from multiple Unicode code points, so reversing code points can still separate complex grapheme clusters such as certain emoji sequences or combining-mark constructions.'
  },
  {
    id: 'slug-generator', title: 'Slug Generator', href: '/text/slug-generator', subcategory: 'Transform & clean',
    description: 'Turn titles and phrases into clean lowercase URL slugs using hyphens or underscores.',
    keywords: 'slug generator url seo permalink lowercase hyphen underscore',
    about: 'Slug Generator normalizes a phrase, removes combining marks, lowercases it, and replaces runs of punctuation or whitespace with a selected separator. Unicode letters and numbers can be retained instead of forcing every slug to ASCII.',
    limitations: 'A valid slug is not automatically an SEO recommendation or a guaranteed valid identifier for every system. Review reserved words, maximum lengths, routing rules, and non-Latin handling for your destination platform.'
  },
  {
    id: 'lorem-ipsum', title: 'Lorem Ipsum Generator', href: '/text/lorem-ipsum', subcategory: 'Generate & summarize',
    description: 'Generate bounded placeholder text by words, sentences, or paragraphs for layouts and prototypes.',
    keywords: 'lorem ipsum generator placeholder dummy text paragraphs sentences words',
    about: 'Lorem Ipsum Generator creates predictable placeholder copy for mockups, typography tests, wireframes, and layout experiments. Choose words, sentences, or paragraphs and the text is generated entirely in the browser.',
    limitations: 'Placeholder text has no semantic relationship to your product or audience and should never be mistaken for final content. Paragraph and sentence generation repeats from a fixed local phrase set.'
  },
  {
    id: 'word-cloud', title: 'Word Cloud Generator', href: '/text/word-cloud', subcategory: 'Count & analyze',
    description: 'Visualize frequent non-stop words as a lightweight browser-rendered word cloud with counts.',
    keywords: 'word cloud generator frequency visualization keywords terms text',
    about: 'Word Cloud Generator counts recurring words and displays the most frequent terms with size scaled to frequency. It is a lightweight local visualization for spotting repeated topics without uploading the source text.',
    limitations: 'The visualization is frequency based and excludes a fixed set of common stop words. Font size represents relative occurrence only; it does not infer importance, sentiment, topic meaning, or keyword quality.'
  },
  {
    id: 'extractive-summarizer', title: 'Extractive Text Summarizer', href: '/text/extractive-summarizer', subcategory: 'Generate & summarize',
    description: 'Select key sentences from longer text using local word-frequency scoring without generative AI.',
    keywords: 'extractive text summarizer summary key sentences frequency local not ai',
    about: 'This summarizer scores sentences by the frequency of informative words, selects the highest-scoring sentences, and restores their original order. It is an extractive algorithm: every sentence in the result comes directly from the supplied text.',
    limitations: 'This is not generative AI and does not understand facts, argument structure, nuance, or intent. Important low-frequency ideas can be omitted, so summaries should be reviewed against the original before use.'
  },
  {
    id: 'grammar-writing', title: 'Grammar & Writing Checker', href: '/text/grammar-writing-checker', subcategory: 'Compare & review',
    description: 'Flag common spelling, repetition, spacing, capitalization, punctuation, and overuse patterns with transparent local rules.',
    keywords: 'grammar writing checker spelling repeated words punctuation capitalization style local rules',
    about: 'Grammar & Writing Checker uses a small transparent set of deterministic browser-side rules to surface possible writing issues. It can catch repeated words, double spaces, selected common misspellings, line-start capitalization, possible missing punctuation, and repeated filler words.',
    limitations: 'This is not a comprehensive grammar engine, dictionary, or language model. Suggestions can be false positives or miss real errors, and the current rule set is primarily intended for ordinary English prose.'
  },
  {
    id: 'text-similarity', title: 'Text Similarity Checker', href: '/text/text-similarity', subcategory: 'Compare & review',
    description: 'Compare two supplied texts using local word n-gram overlap and show matching phrases with a similarity percentage.',
    keywords: 'text similarity compare overlap ngram matching phrases duplicate content local',
    about: 'Text Similarity Checker compares only the two text blocks you provide. It builds normalized word n-gram sets, measures their overlap, and lists matching phrases so you can inspect repeated passages locally.',
    limitations: 'This is not a plagiarism detector and does not search the web, publications, private databases, or copyrighted-source indexes. The percentage is an n-gram overlap measure, not a judgment of originality or authorship.'
  },
]

export const TEXT_PAGES = Object.fromEntries(TEXT_TOOLS.map((tool) => [tool.id, tool]))
export const AVAILABLE_TEXT_TOOLS = TEXT_TOOLS

export function textMetadata(id) {
  const tool = TEXT_PAGES[id]
  if (!tool) throw new Error(`Unknown text tool: ${id}`)
  return createPageMetadata({
    title: `${tool.title} - Free Online Text Tool`,
    description: tool.description,
    pathname: tool.href,
  })
}
