/**
 * JSON-LD builders for Tooliyapa pages.
 * No fabricated ratings, reviews, prices beyond free, or download counts.
 */

import { SITE_NAME, SITE_URL } from '../site.js'
import { absoluteUrl, getToolById, getToolCategory } from './registry.js'
import { getCategoryBySlug } from './categories.js'

export function breadcrumbJsonLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.href || '/'),
    })),
  }
}

export function faqPageJsonLd(faq = []) {
  if (!faq.length) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((entry) => ({
      '@type': 'Question',
      name: entry.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: entry.answer,
      },
    })),
  }
}

/**
 * Honest WebApplication node for a free browser tool.
 */
export function webApplicationJsonLd(toolId) {
  const tool = getToolById(toolId)
  if (!tool) return null
  const category = getToolCategory(tool)
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.name,
    url: absoluteUrl(tool.href),
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript',
    description: tool.seo?.description || tool.shortDescription,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
    },
    ...(category
      ? {
          about: {
            '@type': 'Thing',
            name: category.name,
          },
        }
      : {}),
  }
}

export function toolPageJsonLd(toolId) {
  const tool = getToolById(toolId)
  if (!tool) return []
  const category = getToolCategory(tool)
  const crumbs = [
    { name: 'Home', href: '/' },
    ...(category ? [{ name: category.name, href: category.href }] : []),
    { name: tool.name, href: tool.href },
  ]
  return [breadcrumbJsonLd(crumbs), webApplicationJsonLd(toolId), faqPageJsonLd(tool.faq || [])].filter(
    Boolean
  )
}

export function categoryPageJsonLd(categorySlug) {
  const category = getCategoryBySlug(categorySlug)
  if (!category || category.status !== 'active') return []
  const crumbs = [
    { name: 'Home', href: '/' },
    { name: category.name, href: category.href },
  ]
  return [breadcrumbJsonLd(crumbs)]
}
