/**
 * SEO & Document Metadata Utility for BongoWeb
 * Updates document.title, meta description, OpenGraph, and canonical links dynamically per view
 */

export interface MetaConfig {
  title: string;
  description: string;
  canonicalPath?: string;
  ogType?: string;
}

const BASE_TITLE = 'BongoWeb';
const DEFAULT_DESCRIPTION = 'Explore verified e-commerce, restaurant, blogging, and grocery websites with 24-hour setup, live demos, automated bKash/Nagad checkout, and 24/7 dedicated support.';

export function updatePageSEO(config: MetaConfig): void {
  if (typeof document === 'undefined') return;

  // 1. Update Title
  const fullTitle = config.title.includes(BASE_TITLE) 
    ? config.title 
    : `${config.title} — ${BASE_TITLE}`;
  document.title = fullTitle;

  // 2. Update Meta Description
  let descMeta = document.querySelector('meta[name="description"]');
  if (!descMeta) {
    descMeta = document.createElement('meta');
    descMeta.setAttribute('name', 'description');
    document.head.appendChild(descMeta);
  }
  descMeta.setAttribute('content', config.description || DEFAULT_DESCRIPTION);

  // 3. Update OpenGraph Tags
  const setMetaProperty = (prop: string, content: string) => {
    let el = document.querySelector(`meta[property="${prop}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute('property', prop);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  const setMetaName = (name: string, content: string) => {
    let el = document.querySelector(`meta[name="${name}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute('name', name);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  setMetaProperty('og:title', fullTitle);
  setMetaProperty('og:description', config.description || DEFAULT_DESCRIPTION);
  setMetaName('twitter:title', fullTitle);
  setMetaName('twitter:description', config.description || DEFAULT_DESCRIPTION);

  // 4. Update Canonical Link
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://bongoweb.xyz';
  const canonicalUrl = `${origin}${config.canonicalPath || window.location.pathname}`;

  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', canonicalUrl);
  setMetaProperty('og:url', canonicalUrl);
}
