import React from 'react';
import { renderToString } from 'react-dom/server';
import * as cheerio from 'cheerio';

const store: Record<string, string> = {};
global.localStorage = {
  getItem: (k: string) => store[k] || null,
  setItem: (k: string, v: string) => { store[k] = v; },
  removeItem: (k: string) => { delete store[k]; },
  clear: () => {}
} as any;
global.sessionStorage = {
  getItem: (k: string) => store[k] || null,
  setItem: (k: string, v: string) => { store[k] = v; },
  removeItem: (k: string) => { delete store[k]; },
  clear: () => {}
} as any;
global.window = {
  location: { pathname: '/', search: '', hash: '' },
  scrollTo: () => {},
  addEventListener: () => {},
  removeEventListener: () => {}
} as any;

import { AuthProvider } from '@descope/react-sdk';
import { LanguageProvider } from './src/utils/LanguageContext';
import App from './src/App';

function getPath(el: any, $: any): string {
  const parts: string[] = [];
  let curr = el;
  while (curr && curr.length && curr[0].tagName) {
    const tag = curr[0].tagName.toLowerCase();
    const id = curr.attr('id');
    const prevAllSameTag = curr.prevAll(tag).length;
    const nth = prevAllSameTag + 1;
    const name = id ? `${tag}#${id}` : tag;
    parts.unshift(`${name}:nth-of-type(${nth})`);
    curr = curr.parent();
  }
  return parts.join(' > ');
}

// Test with different routes and modes
const testRoutes = [
  '/', 
  '/dashboard', 
  '/after-order', 
  '/live-chat', 
  '/account', 
  '/website/1042', 
  '/order/1042', 
  '/admin'
];

for (const route of testRoutes) {
  global.window.location.pathname = route;
  if (route === '/account') {
    store['bongoweb_active_view'] = 'account';
  } else if (route === '/dashboard') {
    store['bongoweb_active_view'] = 'dashboard';
    store['bongoweb_chosen_category'] = 'ecommerce';
  } else if (route === '/') {
    store['bongoweb_active_view'] = 'category-picker';
    delete store['bongoweb_chosen_category'];
  } else if (route === '/live-chat') {
    store['bongoweb_active_view'] = 'live-chat';
  } else if (route === '/after-order') {
    store['bongoweb_active_view'] = 'after-order';
  }

  const tree = React.createElement(
    AuthProvider,
    { projectId: 'P3K6LwIDJRlYK19nBi2yewOjmo22' },
    React.createElement(
      LanguageProvider,
      null,
      React.createElement(App)
    )
  );

  const html = `<div id="root">${renderToString(tree)}</div>`;
  const $ = cheerio.load(html);

  // Search for the exact selector
  const targetSel = 'div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > main:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(2)';
  const match = $(targetSel);
  if (match.length > 0) {
    console.log(`FOUND EXACT MATCH on route ${route}!`);
    console.log('CLASS:', match.attr('class'));
    console.log('OUTER HTML:', $.html(match).slice(0, 500));
  }

  // Also search for all elements matching the prefix div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > main:nth-of-type(1)
  const prefix = $('div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > main:nth-of-type(1)');
  if (prefix.length > 0) {
    console.log(`Route ${route}: main found! Direct children:`, prefix.children().map((i, e) => e.tagName).get());
  }
}
