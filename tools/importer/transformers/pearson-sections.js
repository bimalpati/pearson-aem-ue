/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Pearson section breaks and section metadata.
 * Inserts <hr> between sections and adds Section Metadata blocks for sections with styles.
 * Uses template sections from payload.template.sections.
 * All selectors verified from captured DOM in migration-work/cleaned.html.
 *
 * Section selectors from page-templates.json:
 *   section-1: main section.bgcolor--background-dark.has-padding-top--90 (style: "dark")
 *   section-2: main > div > div > section.bgcolor--ui-01:not(.has-padding-top--none)
 *   section-3: main section.bgcolor--ui-01.has-padding-top--none:nth-of-type(3)
 *   section-4: main section.bgcolor--ui-01.has-padding-top--none:nth-of-type(4)
 *   section-5: main section.bgcolor--ui-01.has-padding-top--none.has-padding-bottom--45
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

    // Process sections in reverse order to avoid position shifts
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      const sectionEl = element.querySelector(section.selector);

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
