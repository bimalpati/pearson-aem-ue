/* eslint-disable */
/* global WebImporter */

import heroHomepageParser from './parsers/hero-homepage.js';
import cardsPromoParser from './parsers/cards-promo.js';
import heroBannerParser from './parsers/hero-banner.js';
import columnsFeatureParser from './parsers/columns-feature.js';

import cleanupTransformer from './transformers/pearson-cleanup.js';
import homepageSectionsTransformer from './transformers/homepage-sections.js';

const parsers = {
  'hero-homepage': heroHomepageParser,
  'cards-promo': cardsPromoParser,
  'hero-banner': heroBannerParser,
  'columns-feature': columnsFeatureParser,
};

const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Pearson US homepage with hero, featured content, and promotional sections',
  urls: [
    'https://www.pearson.com/en-us.html',
  ],
  blocks: [
    {
      name: 'hero-homepage',
      instances: ['main section.background-video--waves'],
    },
    {
      name: 'cards-promo',
      instances: ['main section.background-video--waves .carousel-v2'],
    },
    {
      name: 'columns-feature',
      instances: [
        'main section.flex-layout--vertically-centered:not(.bgcolor--background-dark)',
        'main section.column-control:not(.bgcolor--background-medium-gray):not(.bgcolor--background-medium):not(.background-video--waves):not(.flex-layout--vertically-centered):not(.bgcolor--background-dark):not(.he-footer-global) > .container > .row > .col-12 > .content-tile.content-tile-color-block--half-img',
        'main section.bgcolor--background-medium-gray .content-tile.content-tile-landscape--60-40',
        'main section.bgcolor--background-medium.has-padding-bottom--15 .content-tile.content-tile-landscape--17-83',
        'main section.flex-layout--pin-cta',
      ],
    },
    {
      name: 'hero-banner',
      instances: ['main section.bgcolor--background-dark.cc-gradient'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero with Video Background',
      selector: 'main section.background-video--waves',
      style: null,
      blocks: ['hero-homepage', 'cards-promo'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'Video Feature',
      selector: 'main > div > div > .embed > div > section.flex-layout--vertically-centered',
      style: null,
      blocks: ['columns-feature'],
      defaultContent: [],
    },
    {
      id: 'section-3',
      name: 'Study Prep Feature',
      selector: 'main > div > div > .embed > div > section.column-control:nth-of-type(2)',
      style: null,
      blocks: ['columns-feature'],
      defaultContent: [],
    },
    {
      id: 'section-4',
      name: 'College & Career Readiness',
      selector: 'main section.bgcolor--background-dark.cc-gradient',
      style: null,
      blocks: ['hero-banner'],
      defaultContent: [],
    },
    {
      id: 'section-5',
      name: 'Flexible Mobile Learning',
      selector: 'main section.flex-layout--vertically-centered:nth-of-type(2)',
      style: null,
      blocks: ['columns-feature'],
      defaultContent: [],
    },
    {
      id: 'section-6',
      name: 'Transform Careers',
      selector: 'main section.column-control > .container > .row > .col-12 > .content-tile.content-tile-color-block--half-img',
      style: null,
      blocks: ['columns-feature'],
      defaultContent: [],
    },
    {
      id: 'section-7',
      name: 'Learning Never Stops',
      selector: 'main section.bgcolor--background-medium-gray',
      style: 'dark',
      blocks: ['columns-feature'],
      defaultContent: [],
    },
    {
      id: 'section-8',
      name: 'About Pearson',
      selector: [
        'main section.bgcolor--background-medium.has-padding-bottom--15',
        'main section.flex-layout--pin-cta',
      ],
      style: 'grey',
      blocks: ['columns-feature'],
      defaultContent: [],
    },
  ],
};

const transformers = [
  cleanupTransformer,
  homepageSectionsTransformer,
];

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;

    const main = document.body;

    executeTransformers('beforeTransform', main, payload);

    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      }
    });

    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
