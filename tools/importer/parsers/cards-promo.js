/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-promo variant.
 * Base block: cards
 * Source: https://www.pearson.com/en-us.html
 * Selector: main section.background-video--waves .carousel-v2
 * Generated: 2026-05-14
 *
 * Extracts promotional cards from a carousel. Each card contains:
 * - Eyebrow text (.content-tile__eyebrow)
 * - Heading (.content-tile__title)
 * - Description and CTA (.content-tile-text)
 *
 * UE Model (xwalk): container block with card-promo items
 * Fields per item: image (reference), text (richtext)
 */
export default function parse(element, { document }) {
  // Find all carousel card items
  const cardItems = element.querySelectorAll('.carousel__item');

  const cells = [];

  cardItems.forEach((card) => {
    // Extract eyebrow
    const eyebrow = card.querySelector('.content-tile__eyebrow');

    // Extract heading
    const heading = card.querySelector('.content-tile__title, h2, h3');

    // Extract description and CTA from content-tile-text
    const textContainer = card.querySelector('.content-tile-text, .rte-container');

    // Build the text cell content with field hint
    // UE model field: text (richtext) - contains eyebrow, heading, description, CTA
    const textCell = document.createDocumentFragment();
    const textHint = document.createComment(' field:text ');
    textCell.appendChild(textHint);

    if (eyebrow) {
      const eyebrowEl = document.createElement('p');
      eyebrowEl.textContent = eyebrow.textContent.trim();
      textCell.appendChild(eyebrowEl);
    }

    if (heading) {
      const headingEl = document.createElement('h3');
      headingEl.textContent = heading.textContent.trim();
      textCell.appendChild(headingEl);
    }

    if (textContainer) {
      // Get description paragraphs and CTA links
      const paragraphs = textContainer.querySelectorAll('p');
      paragraphs.forEach((p) => {
        const link = p.querySelector('a');
        if (link) {
          // This is a CTA paragraph
          const ctaP = document.createElement('p');
          const ctaLink = document.createElement('a');
          ctaLink.href = link.href;
          ctaLink.textContent = link.textContent.trim();
          if (link.classList.contains('new-window')) {
            ctaLink.target = '_blank';
          }
          ctaP.appendChild(ctaLink);
          textCell.appendChild(ctaP);
        } else {
          // This is a description paragraph
          const descP = document.createElement('p');
          descP.textContent = p.textContent.trim();
          textCell.appendChild(descP);
        }
      });
    }

    // Row: [image (empty for promo cards), text content]
    // Empty image cell - no field hint for empty cells per xwalk hinting rules
    cells.push(['', textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-promo', cells });
  element.replaceWith(block);
}
