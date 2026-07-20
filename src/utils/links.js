export function toHref(website) {
  return website.includes('@') && !website.startsWith('mailto:')
    ? `mailto:${website}`
    : website
}

export function isExternal(href) {
  return !href.startsWith('mailto:')
}

export function linkLabel(url) {
  return url.replace(/^mailto:/, '').replace(/^https?:\/\//, '')
}