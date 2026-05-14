/* eslint-disable */
/* global WebImporter */

import cleanupTransformer from './transformers/pearson-cleanup.js';
import sectionsTransformer from './transformers/pearson-sections.js';

const PAGE_TEMPLATE = {
  name: 'support-k12-educators',
  description: 'Revel support page for K-12 educators with product information and resources',
  urls: [
    'https://www.pearson.com/en-us/higher-education/products-services/revel/support-k-12-educators.html',
  ],
  blocks: [],
  sections: [
    {
      id: 'section-1',
      name: 'Page Title Hero',
      selector: 'main section.bgcolor--background-dark.has-padding-top--90',
      style: 'dark',
      blocks: [],
      defaultContent: [
        'main section.bgcolor--background-dark .content-tile-text h1',
      ],
    },
    {
      id: 'section-2',
      name: 'Introduction',
      selector: 'main > div > div > section.bgcolor--ui-01:not(.has-padding-top--none)',
      style: null,
      blocks: [],
      defaultContent: [
        'main section.bgcolor--ui-01:not(.has-padding-top--none) .content-tile.use-button-tertiary .content-tile-text',
        'main section.bgcolor--ui-01:not(.has-padding-top--none) > .container > .row > div:nth-child(2) > .content-tile:not(.use-button-tertiary) .content-tile-text',
      ],
    },
    {
      id: 'section-3',
      name: 'Educator Preview and Adoption Registration',
      selector: 'main section.bgcolor--ui-01.has-padding-top--none:nth-of-type(3)',
      style: null,
      blocks: [],
      defaultContent: [
        'main section.bgcolor--ui-01.has-padding-top--none:nth-of-type(3) .content-tile-text',
      ],
    },
    {
      id: 'section-4',
      name: 'How to Purchase',
      selector: 'main section.bgcolor--ui-01.has-padding-top--none:nth-of-type(4)',
      style: null,
      blocks: [],
      defaultContent: [
        'main section.bgcolor--ui-01.has-padding-top--none:nth-of-type(4) .content-tile.title-typesize--h1 .content-tile-text',
        'main section.bgcolor--ui-01.has-padding-top--none:nth-of-type(4) .content-tile.pad--0__figure img',
        'main section.bgcolor--ui-01.has-padding-top--none:nth-of-type(4) .content-tile:last-child .content-tile-text',
      ],
    },
    {
      id: 'section-5',
      name: 'Important Purchasing Details',
      selector: 'main section.bgcolor--ui-01.has-padding-top--none.has-padding-bottom--45',
      style: null,
      blocks: [],
      defaultContent: [
        'main section.bgcolor--ui-01.has-padding-top--none.has-padding-bottom--45 .content-tile-text',
      ],
    },
  ],
};

const transformers = [
  cleanupTransformer,
  sectionsTransformer,
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

export default {
  transform: (payload) => {
    const { document, url, params } = payload;

    const main = document.body;

    executeTransformers('beforeTransform', main, payload);
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
        blocks: [],
      },
    }];
  },
};
