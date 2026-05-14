/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Pearson homepage section breaks and section metadata.
 * Inserts <hr> between sections and adds Section Metadata blocks for sections with styles.
 * Uses template sections from payload.template.sections.
 * All selectors verified from captured DOM in migration-work/cleaned.html.
 *
 * Homepage sections from page-templates.json (template: "homepage"):
 *   section-1: main section.background-video--waves (style: null)
 *   section-2: main > div > div > .embed > div > section.flex-layout--vertically-centered (style: null)
 *   section-3: main > div > div > .embed > div > section.column-control:nth-of-type(2) (style: null)
 *   section-4: main section.bgcolor--background-dark.cc-gradient (style: null)
 *   section-5: main section.flex-layout--vertically-centered:nth-of-type(2) (style: null)
 *   section-6: main section.column-control > .container > .row > .col-12 > .content-tile.content-tile-color-block--half-img (style: null)
 *   section-7: main section.bgcolor--background-medium-gray (style: "dark")
 *   section-8: main section.bgcolor--background-medium.has-padding-bottom--15 OR main section.flex-layout--pin-cta (style: "grey")
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.after) {
    const { template } = payload;
    if (!template || !template.sections || template.sections.length < 2) {
      return;
    }

    const document = element.ownerDocument;
    const sections = template.sections;

    // Helper to find a section element supporting both string and array selectors
    function findSectionElement(selector) {
      let found = null;
      if (Array.isArray(selector)) {
        for (let s = 0; s < selector.length && !found; s++) {
          found = element.querySelector(selector[s]);
        }
      } else {
        found = element.querySelector(selector);
      }
      return found; // eslint-disable-line
    }

    // Process sections in reverse order to avoid position shifts
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      const sectionEl = findSectionElement(section.selector);

      if (!sectionEl) {
        continue;
      }

      // Add Section Metadata block if section has a style
      if (section.style) {
        const sectionMetadata = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.append(sectionMetadata);
      }

      // Insert <hr> before every section except the first one
      if (i > 0) {
        const hr = document.createElement('hr');
        sectionEl.before(hr);
      }
    }
  }
}
