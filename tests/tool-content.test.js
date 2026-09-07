import { describe, expect, it } from 'vitest'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import {
  HowToUse,
  RelatedTools,
  ToolFAQ,
  ToolStructuredData,
} from '../components/tooliyapa/ToolPageContent.jsx'

describe('shared tool-page content', () => {
  it('renders how-to steps and FAQs as crawlable semantic content', () => {
    const markup = renderToStaticMarkup(React.createElement('main', null,
      React.createElement(HowToUse, { steps: ['Choose a file.', 'Download the result.'] }),
      React.createElement(ToolFAQ, { items: [{ question: 'Does it upload?', answer: 'No.' }] }),
    ))

    expect(markup).toContain('<ol')
    expect(markup).toContain('Choose a file.')
    expect(markup).toContain('<article')
    expect(markup).toContain('Does it upload?')
  })

  it('uses relative Next.js links for related tools', () => {
    const markup = renderToStaticMarkup(React.createElement(RelatedTools, {
      tools: [{ href: '/split-pdf', title: 'Split PDF', description: 'Extract pages.' }],
    }))

    expect(markup).toContain('href="/split-pdf"')
    expect(markup).not.toMatch(/localhost|www\.tooliyapa|http:\/\//i)
  })

  it('keeps application, FAQ, and breadcrumb schema on the canonical page URL', () => {
    const markup = renderToStaticMarkup(React.createElement(ToolStructuredData, {
      pathname: '/compress-pdf',
      name: 'Compress PDF',
      description: 'Lossless PDF optimization.',
      faqs: [{ question: 'Lossless?', answer: 'Yes.' }],
    }))
    const json = markup.match(/<script[^>]*>(.*)<\/script>/)[1].replaceAll('&quot;', '"')
    const data = JSON.parse(json)

    expect(data['@graph'].map((entry) => entry['@type'])).toEqual([
      'WebApplication', 'FAQPage', 'BreadcrumbList',
    ])
    expect(data['@graph'][0].url).toBe('https://tooliyapa.com/compress-pdf')
    expect(data['@graph'][2].itemListElement[1].item).toBe('https://tooliyapa.com/compress-pdf')
  })
})
